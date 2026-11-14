import { getSettings } from '@/lib/db'
import { SETTINGS_FIELDS, type Field } from '@/lib/admin-schema'
import { saveSettings } from '../actions'
import { FormField, Notice, SubmitButton } from '../form-fields'

export default async function SettingsPage({ searchParams }: PageProps<'/admin/settings'>) {
  const [settings, sp] = await Promise.all([getSettings(), searchParams])
  const known = new Set(SETTINGS_FIELDS.map(f => f.name))
  const extra: Field[] = Object.keys(settings)
    .filter(k => !known.has(k))
    .map(k => ({ name: k, label: k, type: 'textarea' }))

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-fg-strong">Settings</h1>
      {sp.saved && <Notice>Settings saved.</Notice>}
      <form action={saveSettings} className="mt-8 flex max-w-3xl flex-col gap-6">
        {SETTINGS_FIELDS.map(f => (
          <FormField key={f.name} field={f} name={`setting:${f.name}`} value={settings[f.name]} />
        ))}
        {extra.length > 0 && (
          <>
            <h2 className="eyebrow mt-4">Other settings</h2>
            {extra.map(f => (
              <FormField key={f.name} field={f} name={`setting:${f.name}`} value={settings[f.name]} />
            ))}
          </>
        )}
        <div>
          <SubmitButton>Save settings</SubmitButton>
        </div>
      </form>
    </>
  )
}
