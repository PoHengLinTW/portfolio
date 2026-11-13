'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Route } from 'next'
import { requireAdmin } from '@/lib/auth'
import { getDB } from '@/lib/db'
import { getEntity, SETTINGS_FIELDS, type Field } from '@/lib/admin-schema'

function readField(field: Field, form: FormData): string | number {
  const raw = form.get(field.name)
  switch (field.type) {
    case 'boolean':
      return raw === 'on' ? 1 : 0
    case 'number':
      return Number(raw) || 0
    case 'list':
      return JSON.stringify(
        String(raw ?? '')
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean)
      )
    default:
      return String(raw ?? '').replace(/\r\n/g, '\n')
  }
}

export async function saveEntity(entityKey: string, id: string, form: FormData) {
  await requireAdmin()
  const entity = getEntity(entityKey)
  if (!entity) throw new Error(`Unknown content type: ${entityKey}`)

  const values = entity.fields.map(f => readField(f, form))
  for (const [i, f] of entity.fields.entries()) {
    if (f.required && !String(values[i]).trim()) throw new Error(`${f.label} is required.`)
  }

  const cols = entity.fields.map(f => f.name)
  const db = await getDB()
  try {
    if (id === 'new') {
      await db
        .prepare(`INSERT INTO ${entity.table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`)
        .bind(...values)
        .run()
    } else {
      const extra = entity.table === 'case_studies' ? ", updated_at = datetime('now')" : ''
      await db
        .prepare(`UPDATE ${entity.table} SET ${cols.map(c => `${c} = ?`).join(', ')}${extra} WHERE id = ?`)
        .bind(...values, Number(id))
        .run()
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('UNIQUE')) throw new Error('That slug is already used by another entry.')
    throw e
  }

  revalidatePath('/', 'layout')
  redirect(`/admin/${entityKey}?saved=1` as Route)
}

export async function deleteEntity(entityKey: string, id: string) {
  await requireAdmin()
  const entity = getEntity(entityKey)
  if (!entity) throw new Error(`Unknown content type: ${entityKey}`)
  const db = await getDB()
  await db.prepare(`DELETE FROM ${entity.table} WHERE id = ?`).bind(Number(id)).run()
  revalidatePath('/', 'layout')
  redirect(`/admin/${entityKey}?deleted=1` as Route)
}

export async function saveSettings(form: FormData) {
  await requireAdmin()
  const db = await getDB()
  const keys = new Set(SETTINGS_FIELDS.map(f => f.name))
  // Also accept extra keys that already exist in the table (rendered as "Other settings").
  for (const k of form.keys()) if (k.startsWith('setting:')) keys.add(k.slice('setting:'.length))

  const statements = [...keys].map(key => {
    const value = String(form.get(`setting:${key}`) ?? '').replace(/\r\n/g, '\n')
    return db
      .prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
      .bind(key, value)
  })
  await db.batch(statements)
  revalidatePath('/', 'layout')
  redirect('/admin/settings?saved=1')
}
