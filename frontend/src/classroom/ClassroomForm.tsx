import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { Pager } from '../enrollment/shared'
import type { Page } from '../enrollment/shared'

export type ContentRecord = {
  id: number; course_id: number; title: string; description: string | null
  sequence?: number; status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  type?: 'TEXT' | 'LINK' | 'FILE'; external_url?: string | null
  course_unit_id?: number | null; original_filename?: string; file_size?: number
}
export type ContentKind = 'course-units' | 'materials'
export type Abilities = Record<'create' | 'update' | 'publish' | 'archive', boolean>
export type ContentPage = Page<ContentRecord> & { abilities: Abilities }

function UnitPicker({ course, value, onChange }: { course: number; value: string; onChange: (value: string) => void }) {
  const [page, setPage] = useState(1), [result, setResult] = useState<Page<ContentRecord> | null>(null), [error, setError] = useState('')
  useEffect(() => {
    let active = true
    api<Page<ContentRecord>>('/api/v1/courses/' + course + '/units?page=' + page).then(r => { if (active) { setResult(r); setError('') } }).catch(e => { if (active) setError(errorMessage(e)) })
    return () => { active = false }
  }, [course, page])
  return <div><label className="block space-y-2"><span>Unidad del material</span>
    <select className="institutional-field w-full" name="course_unit_id" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">General del curso</option>
      {value && !result?.data.some(u => String(u.id) === value) && <option value={value}>Unidad seleccionada #{value}</option>}
      {result?.data.map(u => <option key={u.id} value={u.id} disabled={u.status === 'ARCHIVED'}>{u.sequence}. {u.title}{u.status === 'ARCHIVED' ? ' (archivada)' : ''}</option>)}
    </select></label><Pager page={result} onPage={setPage} /><Message error>{error}</Message></div>
}

export default function ClassroomForm({ course, kind, record, onSaved, onCancel }: {
  course: number; kind: ContentKind; record: ContentRecord | null; onSaved: () => void; onCancel: () => void
}) {
  const unit = kind === 'course-units'
  const [title, setTitle] = useState(record?.title ?? ''), [description, setDescription] = useState(record?.description ?? '')
  const [sequence, setSequence] = useState(String(record?.sequence ?? 1)), [type, setType] = useState(record?.type ?? 'TEXT')
  const [unitId, setUnitId] = useState(String(record?.course_unit_id ?? '')), [url, setUrl] = useState(record?.external_url ?? '')
  const [file, setFile] = useState<File | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const path = record ? '/api/v1/' + kind + '/' + record.id : '/api/v1/courses/' + course + '/' + (unit ? 'units' : 'materials')
      if (!unit && type === 'FILE') {
        const data = new FormData()
        data.set('title', title); data.set('description', description); data.set('type', type); data.set('course_unit_id', unitId)
        if (record) data.set('_method', 'PATCH')
        if (file) data.set('file', file)
        await api(path, 'POST', data)
      } else {
        await api(path, record ? 'PATCH' : 'POST', unit ? { title, description, sequence: Number(sequence) } : {
          title, description, type, course_unit_id: unitId ? Number(unitId) : null, external_url: type === 'LINK' ? url : null,
        })
      }
      onSaved()
    } catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  return <form onSubmit={e => void submit(e)} className="institutional-card my-5 space-y-4" data-testid="classroom-form">
    <h3 className="text-lg font-semibold">{record ? 'Editar' : 'Crear'} {unit ? 'unidad' : 'material'}</h3>
    <label className="block space-y-2"><span>Título</span><input className="institutional-field w-full" name="title" required maxLength={180} value={title} onChange={e => setTitle(e.target.value)} /></label>
    {unit ? <label className="block space-y-2"><span>Secuencia</span><input className="institutional-field w-full" type="number" name="sequence" required min={1} max={100000} value={sequence} onChange={e => setSequence(e.target.value)} /></label> : <>
      <UnitPicker course={course} value={unitId} onChange={setUnitId} />
      <label className="block space-y-2"><span>Tipo de material</span><select className="institutional-field w-full" name="type" value={type} disabled={!!record} onChange={e => setType(e.target.value as 'TEXT' | 'LINK' | 'FILE')}><option value="TEXT">Texto</option><option value="LINK">Enlace</option><option value="FILE">Archivo</option></select></label>
      {type === 'LINK' && <label className="block space-y-2"><span>Enlace HTTP o HTTPS</span><input className="institutional-field w-full" type="url" name="external_url" required maxLength={2000} value={url} onChange={e => setUrl(e.target.value)} /></label>}
      {type === 'FILE' && <label className="block space-y-2"><span>Archivo (máximo 2 MiB)</span><input className="institutional-field w-full" type="file" name="file" required={!record} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.webp" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        <span className="block text-sm text-brown-medium">PDF, Word, PowerPoint, Excel, texto o imágenes. {record?.original_filename && 'Actual: ' + record.original_filename}</span></label>}
    </>}
    <label className="block space-y-2"><span>{!unit && type === 'TEXT' ? 'Contenido' : 'Descripción'}</span><textarea className="institutional-field min-h-32 w-full" name="description" required={!unit && type === 'TEXT'} maxLength={20000} value={description} onChange={e => setDescription(e.target.value)} /></label>
    <Message error>{error}</Message><div className="flex flex-wrap gap-3"><button className="institutional-button" disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</button><button type="button" className="institutional-button" disabled={busy} onClick={onCancel}>Cancelar</button></div>
    {!record && <p className="text-sm text-brown-medium">Se guardará como borrador. Podrás publicarlo después de revisarlo.</p>}
  </form>
}
