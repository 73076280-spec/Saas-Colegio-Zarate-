import EmptyState from '../components/EmptyState'
import { useState } from 'react'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { Pager } from '../enrollment/shared'
import { OfficeBadge, OfficeSelect, dateLabel, downloadDocument, useOffice, type OfficePage, type OfficeItem } from './shared'

export default function DocumentsPage({ requestId, studentId, embedded = false }: { requestId?: number; studentId?: number; embedded?: boolean }) {
  const [page, setPage] = useState(1), [revision, setRevision] = useState(0), [form, setForm] = useState(false), [student, setStudent] = useState('')
  const [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const { data, loading, error: loadError } = useOffice<OfficePage>('/api/v1/academic-documents?page=' + page + (requestId ? '&academic_request_id=' + requestId : ''), revision)
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError('')
    const payload = new FormData(e.currentTarget)
    if (requestId) payload.set('academic_request_id', String(requestId))
    payload.set('student_id', String(studentId ?? student))
    const file = payload.get('file'); if (file instanceof File && !file.name) payload.delete('file')
    try { await api('/api/v1/academic-documents', 'POST', payload); setForm(false); setRevision(v => v + 1) }
    catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  async function issue(item: OfficeItem, cancel = false) {
    if (!window.confirm(cancel ? '¿Cancelar el documento? Se conservará su historial, pero dejará de estar disponible para el estudiante y su familia.' : '¿Emitir el documento? Sus datos y archivo quedarán conservados.')) return
    setBusy(true); setError('')
    try { await api('/api/v1/academic-documents/' + item.id + (cancel ? '/cancel' : '/issue'), 'POST'); setRevision(v => v + 1) }
    catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  async function download(item: OfficeItem) {
    setBusy(true); setError('')
    try { await downloadDocument(item) } catch { setError('No se pudo descargar el documento o ya no tienes acceso.') } finally { setBusy(false) }
  }
  return <section className="space-y-4" data-testid="academic-documents">
    {embedded ? <h3 className="text-lg font-semibold">Documentos de la solicitud</h3> : <h1 className="text-2xl font-bold">Documentos académicos</h1>}
    <Message error>{error || loadError}</Message>
    {data?.abilities?.create && <button className="institutional-button" onClick={() => setForm(!form)}>Nuevo documento</button>}
    {form && <form data-testid="document-form" className="institutional-card space-y-4 p-4" onSubmit={create}>
      {!studentId && <OfficeSelect label="Estudiante del documento" name="student_id" endpoint="/api/v1/office-options/students" value={student} onChange={setStudent} />}
      <label className="block">Tipo de documento<input name="document_type" className="institutional-field block w-full" placeholder="Constancia, certificado…" maxLength={100} required /></label>
      <label className="block">Archivo privado opcional<input name="file" type="file" className="institutional-field block w-full" accept=".pdf,.txt,.jpg,.jpeg,.png,.gif,.webp,.doc,.xls,.ppt,.docx,.xlsx,.pptx" /></label>
      <p className="text-sm text-brown-medium">Máximo 2 MiB. Sin archivo se registra únicamente la emisión documental.</p>
      <button disabled={busy} className="institutional-button">Guardar documento</button> <button type="button" disabled={busy} className="institutional-button" onClick={() => setForm(false)}>Cancelar</button>
    </form>}
    {loading && <p role="status">Cargando documentos…</p>}{data?.data.length === 0 && <EmptyState>No hay documentos disponibles.</EmptyState>}
    <div className="grid gap-3 sm:grid-cols-2">{data?.data.map(d => <article key={d.id} data-testid="document-card" className="institutional-card space-y-3 p-4">
      <h4 className="font-semibold">{d.document_number} · {d.document_type}</h4><p>{d.student}</p><OfficeBadge value={d.status} /><p>Emisión: {dateLabel(d.issued_at)}</p>
      <p className="break-all">{d.original_filename || 'Sin archivo adjunto'}</p>
      <div className="flex flex-wrap gap-2">{d.status === 'DRAFT' && d.abilities.issue && <button disabled={busy} className="institutional-button" onClick={() => void issue(d)}>Emitir documento</button>}
        {d.status !== 'CANCELLED' && d.abilities.issue && <button disabled={busy} className="institutional-button" onClick={() => void issue(d, true)}>Cancelar documento</button>}
        {d.original_filename && <button disabled={busy} className="institutional-button" onClick={() => void download(d)}>Descargar documento</button>}</div>
    </article>)}</div><Pager page={data} onPage={setPage} />
  </section>
}
