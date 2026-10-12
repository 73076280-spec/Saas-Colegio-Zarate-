import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { api, errorMessage } from '../api/client'
import { useResource } from '../api/useResource'
import { Field, Message, PageHeading } from '../components/Form'
import CampusVisual from '../components/CampusVisual'
type Institution = { id: number; name: string; code: string; legal_name: string | null; tax_id: string | null; email: string | null; phone: string | null; address: string | null }
export default function InstitutionPage() {
  const { user, refresh } = useAuth()
  const resource = useResource<{data: Institution}>('/api/v1/institutions/'+user?.institution_id)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('')
    try { await api('/api/v1/institutions/'+user?.institution_id,'PATCH',Object.fromEntries(new FormData(event.currentTarget))); await refresh() }
    catch (failure) { setError(errorMessage(failure)) } finally { setBusy(false) }
  }
  const institution = resource.data?.data
  return <><PageHeading title="Mi institución" description="Información institucional compartida por tu comunidad." /><Message error>{error || resource.error}</Message>
    {institution?.code === 'ZARATE' && <div className="mb-7"><CampusVisual /></div>}
    {resource.loading ? <p role="status">Cargando institución…</p> : institution && <section className="institutional-card"><p className="institutional-badge mb-6">{institution.code}</p><form onSubmit={save} className="grid gap-5 sm:grid-cols-2">
      <Field label="Nombre" name="name" defaultValue={institution.name} required maxLength={255} />
      <Field label="Razón social" name="legal_name" defaultValue={institution.legal_name || ''} maxLength={255} />
      <Field label="Identificación tributaria" name="tax_id" defaultValue={institution.tax_id || ''} maxLength={30} />
      <Field label="Correo" name="email" type="email" defaultValue={institution.email || ''} maxLength={255} />
      <Field label="Teléfono" name="phone" defaultValue={institution.phone || ''} maxLength={30} />
      <Field label="Dirección" name="address" defaultValue={institution.address || ''} maxLength={255} />
      <button className="institutional-button sm:col-span-2" disabled={busy || !user?.permissions.includes('institutions.update')}>{busy ? 'Guardando…' : 'Guardar institución'}</button>
    </form></section>}</>
}
