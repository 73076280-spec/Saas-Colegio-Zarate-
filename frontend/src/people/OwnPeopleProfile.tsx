import { useResource } from '../api/useResource'
import { Message } from '../components/Form'
import { personCatalogs, personLabels } from './config'
import type { Person, PersonType } from './config'
import FamilyPanel from './FamilyPanel'
export default function OwnPeopleProfile() {
  const result = useResource<{data: Record<PersonType,Person | null>}>('/api/v1/profile/people')
  const profiles = Object.entries(result.data?.data || {}).filter((entry): entry is [PersonType,Person] => entry[1] !== null)
  if (result.loading) return <p role="status" className="mt-6">Cargando perfil institucional…</p>
  if (result.error) return <Message error>{result.error}</Message>
  if (!profiles.length) return null
  return <div className="mt-6 grid gap-6">{profiles.map(([type,person]) => <section className="institutional-card" key={type}><h2 className="text-xl font-semibold">Mi perfil de {personCatalogs[type].singular}</h2><span className="institutional-badge mt-3">{personLabels[person.status]}</span><dl className="mt-5 grid gap-4 sm:grid-cols-2">{personCatalogs[type].fields.map(field => <div key={field.name}><dt className="text-sm text-brown-medium">{field.label}</dt><dd className="mt-1 break-words">{field.options?.[String(person[field.name])] || String(person[field.name] || '—')}</dd></div>)}</dl></section>)}<FamilyPanel path="/api/v1/profile/family" own /></div>
}
