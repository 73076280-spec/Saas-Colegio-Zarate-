import { useResource } from '../api/useResource'
import { Message } from '../components/Form'
import { personCatalogs, personLabels } from './config'
import type { Person, PersonType } from './config'
import FamilyPanel from './FamilyPanel'
import Avatar from '../components/Avatar'
import StatusBadge from '../components/StatusBadge'
import ProfileAcademicSummary from './ProfileAcademicSummary'
import { useAuth } from '../auth/AuthContext'
export default function OwnPeopleProfile() {
  const { user } = useAuth()
  const result = useResource<{data: Record<PersonType,Person | null>}>('/api/v1/profile/people')
  const profiles = Object.entries(result.data?.data || {}).filter((entry): entry is [PersonType,Person] => entry[1] !== null)
  if (result.loading) return <p role="status" className="mt-6">Cargando perfil institucional…</p>
  if (result.error) return <Message error>{result.error}</Message>
  if (!profiles.length) return null
  return <div className="mt-6 grid gap-6">{profiles.map(([type,person]) => <section className="institutional-card" key={type}>
    <div className="flex items-center gap-4"><Avatar name={person.user?.name || 'Cuenta archivada'} src={user?.avatar_url} /><div><h2 className="text-xl font-semibold">Mi perfil de {personCatalogs[type].singular}</h2><div className="mt-2"><StatusBadge value={person.status}>{personLabels[person.status]}</StatusBadge></div></div></div>
    <dl className="mt-5 grid gap-4 sm:grid-cols-2">{personCatalogs[type].fields.map(field => <div key={field.name}><dt className="text-sm text-brown-medium">{field.label}</dt><dd className="mt-1 break-words">{field.options?.[String(person[field.name])] || String(person[field.name] || '—')}</dd></div>)}</dl>
    {type === 'students' && <ProfileAcademicSummary studentId={person.id} />}{type === 'teachers' && <ProfileAcademicSummary />}
  </section>)}<FamilyPanel path="/api/v1/profile/family" own /></div>
}
