import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { Pager } from '../enrollment/shared'
import ClassroomForm from './ClassroomForm'
import type { ContentKind, ContentPage, ContentRecord } from './ClassroomForm'

const labels = { DRAFT: 'Borrador', PUBLISHED: 'Publicado', ARCHIVED: 'Archivado' }

export default function Classroom({ course, closed }: { course: number; closed: boolean }) {
  const [units, setUnits] = useState<ContentPage | null>(null), [materials, setMaterials] = useState<ContentPage | null>(null)
  const [unitPage, setUnitPage] = useState(1), [materialPage, setMaterialPage] = useState(1), [revision, setRevision] = useState(0)
  const [filter, setFilter] = useState<{ id: number; title: string } | null>(null)
  const [form, setForm] = useState<{ kind: ContentKind; record: ContentRecord | null } | null>(null)
  const [error, setError] = useState(''), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  useEffect(() => {
    let active = true
    Promise.all([
      api<ContentPage>('/api/v1/courses/' + course + '/units?page=' + unitPage),
      api<ContentPage>('/api/v1/courses/' + course + '/materials?page=' + materialPage + (filter ? '&course_unit_id=' + filter.id : '')),
    ]).then(([u, m]) => { if (active) { setUnits(u); setMaterials(m); setError('') } })
      .catch(e => { if (active) { setError(errorMessage(e)); setUnits(null); setMaterials(null) } })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [course, unitPage, materialPage, revision, filter])
  function refresh() { setLoading(true); setRevision(v => v + 1) }
  async function action(kind: ContentKind, record: ContentRecord, operation: 'publish' | 'archive') {
    if (!window.confirm((operation === 'publish' ? '¿Publicar ' : '¿Archivar ') + record.title + '?')) return
    setBusy(true); setError(''); setNotice('')
    try {
      await api('/api/v1/' + kind + '/' + record.id + '/' + operation, 'POST', {})
      setNotice(operation === 'publish' ? 'Contenido publicado.' : 'Contenido archivado.'); refresh()
    } catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  async function download(record: ContentRecord) {
    setBusy(true); setError('')
    try {
      const response = await fetch('/api/v1/materials/' + record.id + '/download', { credentials: 'include', headers: { Accept: 'application/octet-stream', 'X-Requested-With': 'XMLHttpRequest' } })
      if (!response.ok) throw new Error('El archivo ya no está disponible o no tienes acceso.')
      const url = URL.createObjectURL(await response.blob())
      const link = document.createElement('a')
      link.href = url; link.download = record.original_filename ?? 'material'; link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo descargar el archivo.') } finally { setBusy(false) }
  }
  function actions(kind: ContentKind, r: ContentRecord, data: ContentPage | null) {
    if (closed || r.status === 'ARCHIVED') return null
    return <div className="mt-3 flex flex-wrap gap-2">
      {data?.abilities.update && <button className="institutional-button" disabled={busy} onClick={() => { setForm({ kind, record: r }); setNotice('') }}>Editar</button>}
      {data?.abilities.publish && r.status === 'DRAFT' && <button className="institutional-button" disabled={busy} onClick={() => void action(kind, r, 'publish')}>Publicar</button>}
      {data?.abilities.archive && <button className="institutional-button" disabled={busy} onClick={() => void action(kind, r, 'archive')}>Archivar</button>}
    </div>
  }
  return <section className="rounded-xl border border-beige bg-background-soft p-4 sm:p-6" data-testid="classroom">
    <h3 className="text-xl font-semibold">Aula Virtual</h3><p className="mt-2 text-sm text-brown-medium">Unidades y recursos para acompañar tu aprendizaje.</p>
    {closed && <p className="mt-3">Curso cerrado. Se conserva el historial del aula.</p>}
    <Message error>{error}</Message><Message>{notice}</Message>
    {error && <button className="institutional-button my-3" onClick={refresh}>Volver a intentar</button>}
    <div className="my-4 flex flex-wrap gap-3">
      {!closed && units?.abilities.create && <button className="institutional-button" onClick={() => { setForm({ kind: 'course-units', record: null }); setNotice('') }}>Crear unidad</button>}
      {!closed && materials?.abilities.create && <button className="institutional-button" onClick={() => { setForm({ kind: 'materials', record: null }); setNotice('') }}>Crear material</button>}
    </div>
    {form && <ClassroomForm key={form.kind + (form.record?.id ?? 'new')} course={course} {...form} onCancel={() => setForm(null)} onSaved={() => { setForm(null); setNotice('Contenido guardado.'); refresh() }} />}
    {loading && <p role="status">Cargando aula…</p>}
    <h4 className="my-3 text-lg font-semibold">Unidades</h4>
    <div className="grid gap-4 lg:grid-cols-2">{units?.data.map(u => <article key={u.id} className="institutional-card min-w-0" data-testid="unit-card">
      <span className="rounded-full bg-beige px-3 py-1 text-sm text-text-dark">{labels[u.status]}</span>
      <h5 className="mt-3 break-words font-semibold">{u.sequence}. {u.title}</h5><p className="mt-2 whitespace-pre-wrap break-words text-sm">{u.description}</p>
      <button className="mt-3 font-semibold text-brown-medium underline" onClick={() => { setFilter({ id: u.id, title: u.title }); setMaterialPage(1); setLoading(true) }}>Ver materiales</button>
      {actions('course-units', u, units)}
    </article>)}</div>
    {!loading && units?.data.length === 0 && <p>No hay unidades disponibles.</p>}
    <div data-testid="unit-pagination"><Pager page={units} onPage={p => { setUnitPage(p); setLoading(true) }} /></div>
    <h4 className="my-3 text-lg font-semibold">Materiales{filter ? ' · ' + filter.title : ''}</h4>
    {filter && <button className="institutional-button mb-3" onClick={() => { setFilter(null); setMaterialPage(1); setLoading(true) }}>Todos los materiales</button>}
    <div className="grid gap-4 lg:grid-cols-2">{materials?.data.map(m => <article key={m.id} className="institutional-card min-w-0" data-testid="material-card">
      <span className="rounded-full bg-beige px-3 py-1 text-sm text-text-dark">{labels[m.status]} · {m.type === 'FILE' ? 'Archivo' : m.type === 'LINK' ? 'Enlace' : 'Texto'}</span>
      <h5 className="mt-3 break-words font-semibold">{m.title}</h5>
      <p className="mt-2 whitespace-pre-wrap break-words text-sm">{m.description}</p>
      {m.type === 'LINK' && m.external_url && /^https?:\/\//i.test(m.external_url) && <a className="mt-3 inline-block font-semibold text-brown-medium underline" href={m.external_url} target="_blank" rel="noopener noreferrer">Abrir enlace (nueva pestaña)</a>}
      {m.type === 'FILE' && <button className="institutional-button mt-3 max-w-full break-words" disabled={busy} onClick={() => void download(m)}>Descargar {m.original_filename}</button>}
      {actions('materials', m, materials)}
    </article>)}</div>
    {!loading && materials?.data.length === 0 && <p>No hay materiales disponibles.</p>}
    <div data-testid="material-pagination"><Pager page={materials} onPage={p => { setMaterialPage(p); setLoading(true) }} /></div>
  </section>
}
