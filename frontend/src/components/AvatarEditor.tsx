import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import type { User } from '../auth/types'
import { roleLabels } from '../auth/types'
import { api, errorMessage } from '../api/client'
import Avatar from './Avatar'
import Icon from './Icon'
import { Message } from './Form'

export default function AvatarEditor() {
  const { user, setUser } = useAuth()
  const [file, setFile] = useState<File | null>(null), [preview, setPreview] = useState('')
  const [error, setError] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])
  if (!user) return null
  function choose(next: File | undefined) {
    setError(''); setMessage(''); setFile(null); setPreview('')
    if (!next) return
    if (!['image/jpeg','image/png','image/webp'].includes(next.type) || next.size > 2 * 1024 * 1024) {
      setError('Elige una imagen JPG, PNG o WebP de hasta 2 MB.'); if (input.current) input.current.value = ''; return
    }
    setFile(next)
  }
  async function save(remove = false) {
    setBusy(true); setError(''); setMessage('')
    const body = new FormData()
    if (file) body.append('photo', file)
    try {
      const response = await api<{data: User}>('/api/v1/profile/avatar', remove ? 'DELETE' : 'POST', remove ? undefined : body)
      setUser(response.data); setFile(null); setPreview(''); if (input.current) input.current.value = ''
      setMessage(remove ? 'Foto eliminada.' : 'Foto actualizada.')
    } catch (failure) { setError(errorMessage(failure)) } finally { setBusy(false) }
  }
  return <section className="mb-6" aria-label="Foto de perfil"><div className="profile-banner">
    <Avatar name={user.name} src={preview || user.avatar_url} size="lg" />
    <div className="min-w-0 flex-1"><h2 className="text-xl font-semibold break-words">{user.name}</h2><p className="mt-1 text-sm text-brown-medium">{user.roles.map(role => roleLabels[role]).join(' · ')}</p><p className="mt-1 text-xs text-brown-medium">{user.institution.name}</p>
      {user.permissions.includes('profile.update') && <div className="mt-4"><label className="button-secondary cursor-pointer"><Icon name="camera" />Elegir foto<input ref={input} type="file" name="photo" aria-label="Foto de perfil" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={event => choose(event.target.files?.[0])} /></label><p className="mt-2 text-xs text-brown-medium">JPG, PNG o WebP · Hasta 2 MB y 4096 × 4096 px.</p></div>}
    </div>
    {user.permissions.includes('profile.update') && <div className="flex flex-wrap gap-2">{file && <><button className="institutional-button" disabled={busy} onClick={() => void save()}>{busy ? 'Guardando…' : 'Guardar foto'}</button><button className="button-secondary" disabled={busy} onClick={() => { setFile(null); setPreview(''); if (input.current) input.current.value = '' }}>Cancelar foto</button></>}{user.avatar_url && !file && <button className="button-secondary" disabled={busy} onClick={() => { if (window.confirm('¿Eliminar tu foto de perfil?')) void save(true) }}>Eliminar foto</button>}</div>}
  </div><Message error>{error}</Message><Message>{message}</Message></section>
}
