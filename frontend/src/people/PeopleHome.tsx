import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { PageHeading } from '../components/Form'
import { personCatalogs } from './config'
export default function PeopleHome() {
  const { user } = useAuth()
  const available = Object.entries(personCatalogs).filter(([type]) => user?.permissions.includes(type+'.view'))
  return <><PageHeading title="Personas" description="Gestiona los perfiles y vínculos de tu comunidad educativa." /><div className="grid gap-5 sm:grid-cols-3">{available.map(([type,config]) => <Link key={type} to={'/app/people/'+type} className="institutional-card border-t-4 border-t-primary"><h2 className="text-xl font-semibold">{config.title}</h2><p className="mt-3 text-sm text-brown-medium">Consultar perfiles institucionales</p></Link>)}</div>{!available.length && <p role="alert">No tienes permisos para administrar personas.</p>}</>
}
