import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { api, ApiError, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { catalogs, statusLabels, displayValue } from './catalogs'
import type { AcademicEntry } from './catalogs'
import RelationSelect from './RelationSelect'
export default function AcademicForm({ catalog, record, defaults, saved, cancel }: {
  catalog: string; record: AcademicEntry | null; defaults: Record<string, string>; saved: () => void; cancel: () => void
}) {
  const { user } = useAuth()
  const definition = catalogs[catalog]
  const [relations, setRelations] = useState<Record<string, string>>(() => Object.fromEntries(definition.fields.filter(field => field.relation).map(field => [field.name, String(record?.[field.name] || defaults[field.name] || '')])))
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const statuses = catalog.startsWith('academic-') ? ['DRAFT','ACTIVE'] : ['ACTIVE','INACTIVE']
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setErrors({}); setError('')
    const form = new FormData(event.currentTarget)
    const payload: Record<string, unknown> = Object.fromEntries(form)
    for (const field of definition.fields) {
      if (field.type === 'checkbox') payload[field.name] = form.has(field.name)
      if (field.type === 'number') payload[field.name] = form.get(field.name) === '' ? (field.required ? '' : field.name === 'sort_order' ? 0 : null) : Number(form.get(field.name))
      if (field.relation && record) delete payload[field.name]
    }
    try { await api('/api/v1/'+catalog+(record ? '/'+record.id : ''), record ? 'PATCH' : 'POST', payload); saved() }
    catch (failure) { setError(errorMessage(failure)); if (failure instanceof ApiError) setErrors(failure.errors) }
    finally { setBusy(false) }
  }
  return <section className="institutional-card mb-6" aria-labelledby="form-title">
    <h2 id="form-title" className="mb-6 text-xl font-semibold">{record ? 'Editar' : 'Crear'} {definition.singular}</h2>
    <Message error>{error}</Message>
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      {definition.fields.map(field => {
        const error = errors[field.name]?.join(' ')
        const id = 'field-'+field.name
        if (field.relation) return <RelationSelect key={field.name} catalog={field.relation} name={field.name} label={field.label} value={relations[field.name]} onChange={value => setRelations(current => ({ ...current, [field.name]: value }))} required={field.required} disabled={!!record || busy} error={error} selectedLabel={displayValue(record?.[field.name.replace('_id','')])} />
        if (field.type === 'checkbox') return <label className="flex items-center gap-3 text-sm" key={field.name}><input type="checkbox" name={field.name} defaultChecked={!!record?.[field.name]} disabled={busy} />{field.label}</label>
        return <div className="grid content-start gap-2" key={field.name}>
          <label htmlFor={id} className="text-sm font-medium">{field.label}</label>
          {field.type === 'textarea' ? <textarea id={id} name={field.name} className="institutional-field" defaultValue={String(record?.[field.name] || '')} maxLength={5000} rows={3} /> :
            <input id={id} name={field.name} className="institutional-field" type={field.type || 'text'} defaultValue={record?.[field.name] == null ? '' : String(record[field.name])} required={field.required} min={field.min} max={field.max} maxLength={field.name === 'code' ? 40 : 100} aria-invalid={!!error} aria-describedby={error ? id+'-error' : undefined} />}
          {error && <p id={id+'-error'} className="text-sm text-brown-medium">{error}</p>}
        </div>
      })}
      <label className="grid gap-2 text-sm font-medium">Estado<select name="status" defaultValue={record?.status || (catalog.startsWith('academic-') ? 'DRAFT' : 'ACTIVE')} className="institutional-field">{statuses.filter(status => !(catalog === 'subjects' && status === 'INACTIVE' && !user?.permissions.includes('subjects.disable'))).map(status => <option value={status} key={status}>{statusLabels[status]}</option>)}</select></label>
      <div className="flex flex-wrap gap-4 sm:col-span-2"><button className="institutional-button" disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</button><button type="button" disabled={busy} className="px-4 underline" onClick={cancel}>Cancelar</button></div>
    </form>
  </section>
}
