import type { ReactNode } from 'react'
import Icon from './Icon'
export default function EmptyState({ children, hint = 'Prueba con otros filtros o vuelve más adelante.' }: { children: ReactNode; hint?: string }) {
  return <div className="empty-state"><div className="empty-art" aria-hidden="true"><span /><span /><span className="empty-state-icon"><Icon name="book" /></span></div><p className="font-semibold text-text-dark">{children}</p><p className="mt-2 max-w-sm text-sm leading-6 text-brown-medium">{hint}</p></div>
}
