import 'server-only'
import { cache } from 'react'
import { connection } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'

/** The D1 binding. Calling this opts the route into request-time rendering, so admin edits show up without a redeploy. */
export async function getDB(): Promise<D1Database> {
  await connection()
  const { env } = await getCloudflareContext({ async: true })
  return env.DB
}

export type Settings = Record<string, string>

export interface CaseStudy {
  id: number
  slug: string
  title: string
  summary: string
  period: string
  role: string
  result: string
  tags: string[]
  body_md: string
  sort: number
  published: number
}

export interface Role {
  id: number
  company: string
  title: string
  location: string
  start: string
  end: string
  url: string
  summary: string
  highlights: string[]
  tags: string[]
  sort: number
}

export interface Project {
  id: number
  name: string
  period: string
  description: string
  details: string[]
  tags: string[]
  image_url: string
  link_url: string
  link_label: string
  sort: number
}

export interface Education {
  id: number
  school: string
  degree: string
  location: string
  period: string
  sort: number
}

export interface SkillGroup {
  id: number
  name: string
  items: string[]
  sort: number
}

export interface Post {
  id: number
  slug: string
  title: string
  summary: string
  body_md: string
  published_at: string
  published: number
}

/** Columns that hold JSON arrays of strings. */
export const LIST_COLUMNS = new Set(['tags', 'highlights', 'details', 'items'])

function parseList(value: unknown): string[] {
  if (typeof value !== 'string' || !value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

function decode<T>(row: Record<string, unknown>): T {
  const out: Record<string, unknown> = { ...row }
  for (const key of Object.keys(out)) {
    if (LIST_COLUMNS.has(key)) out[key] = parseList(out[key])
  }
  return out as T
}

async function all<T>(sql: string, ...binds: unknown[]): Promise<T[]> {
  const db = await getDB()
  const { results } = await db.prepare(sql).bind(...binds).all<Record<string, unknown>>()
  return results.map(r => decode<T>(r))
}

async function first<T>(sql: string, ...binds: unknown[]): Promise<T | null> {
  const db = await getDB()
  const row = await db.prepare(sql).bind(...binds).first<Record<string, unknown>>()
  return row ? decode<T>(row) : null
}

// Wrapped in React `cache` so a page and its generateMetadata share one query per request.

export const getSettings = cache(async (): Promise<Settings> => {
  const rows = await all<{ key: string; value: string }>('SELECT key, value FROM settings')
  return Object.fromEntries(rows.map(r => [r.key, r.value]))
})

export const getCaseStudies = cache((includeDrafts = false) =>
  all<CaseStudy>(
    `SELECT * FROM case_studies ${includeDrafts ? '' : 'WHERE published = 1'} ORDER BY sort, id`
  )
)

export const getCaseStudy = cache((slug: string) =>
  first<CaseStudy>('SELECT * FROM case_studies WHERE slug = ? AND published = 1', slug)
)

export const getRoles = cache(() => all<Role>('SELECT * FROM roles ORDER BY sort, id'))

export const getProjects = cache(() => all<Project>('SELECT * FROM projects ORDER BY sort, id'))

export const getEducation = cache(() => all<Education>('SELECT * FROM education ORDER BY sort, id'))

export const getSkillGroups = cache(() =>
  all<SkillGroup>('SELECT * FROM skill_groups ORDER BY sort, id')
)

export const getPosts = cache(() =>
  all<Post>('SELECT * FROM posts WHERE published = 1 ORDER BY published_at DESC, id DESC')
)

export const getPost = cache((slug: string) =>
  first<Post>('SELECT * FROM posts WHERE slug = ? AND published = 1', slug)
)
