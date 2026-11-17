import 'server-only'
import { cache } from 'react'
import { getDB } from './db'

/**
 * Cookie-free view, visitor and read counts for writing posts, in D1 (see migrations/0006_post_stats.sql).
 * A visitor is sha256(daily random salt | IP | user agent); salts and hashes are dropped after
 * their day, so nothing stored identifies a person and each visitor counts once per post per day.
 */

export type HitKind = 'view' | 'read'

const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly|curl|wget|python|httpclient/i

export function isBot(userAgent: string): boolean {
  return !userAgent || BOT_UA.test(userAgent)
}

const today = () => new Date().toISOString().slice(0, 10)

async function visitorHash(db: D1Database, day: string, ip: string, userAgent: string): Promise<string> {
  const [, salted] = await db.batch<{ salt: string }>([
    db.prepare('INSERT OR IGNORE INTO stats_salts (day, salt) VALUES (?, lower(hex(randomblob(16))))').bind(day),
    db.prepare('SELECT salt FROM stats_salts WHERE day = ?').bind(day)
  ])
  const salt = salted.results[0]?.salt ?? ''
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}|${ip}|${userAgent}`))
  return Array.from(new Uint8Array(digest).slice(0, 16), b => b.toString(16).padStart(2, '0')).join('')
}

/** Records a view or read of a published post. Returns false (and records nothing) for any other slug. */
export async function recordHit(kind: HitKind, slug: string, ip: string, userAgent: string): Promise<boolean> {
  const db = await getDB()
  if (!(await db.prepare('SELECT 1 FROM posts WHERE slug = ? AND published = 1').bind(slug).first())) return false

  const day = today()
  const hash = await visitorHash(db, day, ip, userAgent)
  const [seen] = await db.batch([
    db.prepare('INSERT OR IGNORE INTO stats_seen (day, kind, slug, hash) VALUES (?, ?, ?, ?)').bind(day, kind, slug, hash)
  ])
  const isNew = seen.meta.changes ? 1 : 0
  // Views count every load; visitors and reads count once per visitor per day.
  const [views, visitors, reads] = kind === 'view' ? [1, isNew, 0] : [0, 0, isNew]
  if (views || reads) {
    await db
      .prepare(
        `INSERT INTO post_stats (slug, day, views, visitors, reads) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT (slug, day) DO UPDATE SET
           views = views + excluded.views, visitors = visitors + excluded.visitors, reads = reads + excluded.reads`
      )
      .bind(slug, day, views, visitors, reads)
      .run()
  }

  // Occasionally forget previous days' visitor hashes and salts.
  if (Math.random() < 0.02) {
    await db.batch([
      db.prepare('DELETE FROM stats_seen WHERE day < ?').bind(day),
      db.prepare('DELETE FROM stats_salts WHERE day < ?').bind(day)
    ])
  }
  return true
}

/** All-time reads of a post, shown publicly on it. */
export const getReads = cache(async (slug: string): Promise<number> => {
  const db = await getDB()
  return (await db.prepare('SELECT COALESCE(SUM(reads), 0) AS n FROM post_stats WHERE slug = ?').bind(slug).first<number>('n')) ?? 0
})

export interface StatTotals {
  views: number
  visitors: number
  reads: number
}

export interface PostStats extends StatTotals {
  slug: string
  title: string | null
  recentViews: number
  recentVisitors: number
  recentReads: number
}

/** Admin data: per-post totals (all time and last 30 days), most-read first. */
export async function getPostStats(): Promise<PostStats[]> {
  const db = await getDB()
  const since = new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10)
  const { results } = await db
    .prepare(
      `SELECT s.slug, p.title,
              SUM(s.views) AS views, SUM(s.visitors) AS visitors, SUM(s.reads) AS reads,
              COALESCE(SUM(CASE WHEN s.day >= ?1 THEN s.views END), 0) AS recentViews,
              COALESCE(SUM(CASE WHEN s.day >= ?1 THEN s.visitors END), 0) AS recentVisitors,
              COALESCE(SUM(CASE WHEN s.day >= ?1 THEN s.reads END), 0) AS recentReads
       FROM post_stats s LEFT JOIN posts p ON p.slug = s.slug
       GROUP BY s.slug ORDER BY reads DESC, views DESC, s.slug`
    )
    .bind(since)
    .all<PostStats>()
  return results
}
