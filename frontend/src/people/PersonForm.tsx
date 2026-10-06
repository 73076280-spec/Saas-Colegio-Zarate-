import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { api, ApiError, errorMessage } from '../api/client'
import { Field, Message } from '../components/Form'
import { personCatalogs, personLabels } from './config'
import type { Person, PersonType } from './config'
import PeopleLookup from './PeopleLookup'
export default function PersonForm({ type, person, saved, cancel }: { type: PersonType; person: Person | null; saved: () => void; cancel: () => void }) {
  const { user } = useAuth()
  const [mode, setMode] = useState('new')
  const [accountId, setAccountId] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string,string[]>>({})
  const definition = personCatalogs[type]
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setErrors({})
    const form = new FormData(event.currentTarget)
    const payload: Record<string,unknown> = {}
    for (const field of definition.fields) payload[field.name] = form.get(field.name) || null
    if (form.has('status')) payload.status = form.get('status')
    if (!person) {
      if (mode === 'existing') payload.user_id = Number(accountId)
      else payload.account = Object.fromEntries(['first_name','last_name','email','password','phone'].map(field => [field,form.get(field) || null]))
    }
    try { await api('/api/v1/'+type+(person ? '/'+person.id : ''),person ? 'PATCH' : 'POST',payload); saved() }
    catch (failure) { setError(errorMessage(failure)); if (failure instanceof ApiError) setErrors(failure.errors) }
    finally { setBusy(false) }
  }
  return <section className="institutional-card mb-6"><h2 className="mb-5 text-xl font-semibold">{person ? 'Editar' : 'Nuevo'} {definition.singular}</h2>
    <Message error>{error}</Message><form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      {!person && <fieldset className="flex flex-wrap gap-5 sm:col-span-2"><legend className="mb-3 font-semibold">Cuenta de acceso</legend>{[['new','Crear cuenta'],['existing','Usar cuenta existente']].map(([value,label]) => <label className="flex items-center gap-2 text-sm" key={value}><input type="radio" name="account_mode" value={value} checked={mode===value} onChange={() => setMode(value)} />{label}</label>)}</fieldset>}
      {!person && mode === 'new' && <><Field name="first_name" label="Nombres" required maxLength={100} /><Field name="last_name" label="Apellidos" required maxLength={100} /><Field name="email" label="Correo electrónico" type="email" required autoComplete="off" /><Field name="password" label="Contraseña inicial" type="password" required minLength={12} maxLength={128} autoComplete="new-password" /><Field name="phone" label="Teléfono (opcional)" maxLength={30} /><p className="self-center text-sm text-brown-medium">La contraseña debe incluir al menos 12 caracteres, mayúsculas, minúsculas y números. La persona deberá cambiarla al ingresar.</p></>}
      {!person && mode === 'existing' && <div className="sm:col-span-2"><PeopleLookup path={'/api/v1/'+type+'/accounts'} label="Cuenta compatible" name="user_id" value={accountId} change={setAccountId} error={errors.user_id?.join(' ')} /><p className="mt-2 text-sm text-brown-medium">Solo se muestran cuentas de esta institución con el rol correspondiente y sin este perfil.</p></div>}
      {person && <p className="rounded-xl bg-background-soft p-4 text-sm sm:col-span-2">Cuenta: {person.user?.name} · {person.user?.email || '—'}. Los datos de acceso se administran en Usuarios o Mi perfil, según los permisos.</p>}
      {definition.fields.map(field => <label key={field.name} className="grid content-start gap-2 text-sm font-medium"><span>{field.label}</span>
        {field.type === 'select' ? <select name={field.name} className="institutional-field" defaultValue={String(person?.[field.name] || (field.name === 'document_type' ? 'DNI' : ''))} required={field.required} aria-invalid={!!errors[field.name]}><option value="">Seleccionar</option>{Object.entries(field.options || {}).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select> :
        <input name={field.name} type={field.type || 'text'} className="institutional-field" required={field.required} maxLength={field.max} defaultValue={String(person?.[field.name] || '')} aria-invalid={!!errors[field.name]} />}
        {errors[field.name] && <span className="text-xs text-brown-medium">{errors[field.name].join(' ')}</span>}
      </label>)}
      {user?.permissions.includes(type+'.disable') && <label className="grid gap-2 text-sm font-medium">Estado<select name="status" className="institutional-field" defaultValue={person?.status || 'ACTIVE'}>{definition.statuses.map(status => <option key={status} value={status}>{personLabels[status]}</option>)}</select></label>}
      <div className="flex gap-4 sm:col-span-2"><button className="institutional-button" disabled={busy}>{busy ? 'Guardando…' : 'Guardar persona'}</button><button className="underline" type="button" disabled={busy} onClick={cancel}>Cancelar</button></div>
    </form></section>
}
