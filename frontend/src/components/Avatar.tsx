import { useState } from 'react'
export default function Avatar({ name, src, size = 'md' }: { name: string; src?: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const [failed, setFailed] = useState<string | null>(null)
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase()
  return <span className={'avatar avatar-' + size}>
    {src && failed !== src ? <img src={src} alt={'Foto de ' + name} onError={() => setFailed(src)} /> : <span aria-label={'Iniciales de ' + name}>{initials || 'Z'}</span>}
  </span>
}
