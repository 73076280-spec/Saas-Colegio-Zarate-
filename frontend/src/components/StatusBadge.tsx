import type { ReactNode } from 'react'
export default function StatusBadge({ value, children }: { value?: string | number | null; children?: ReactNode }) {
  const state = String(value ?? children ?? '').toUpperCase()
  const tone = /^(APPROVED|ACTIVE|PAID|VALIDATED|PUBLISHED|ISSUED|COMPLETED|PRESENT|JUSTIFIED|APROBADA|APROBADO|ACTIVO|ACTIVA|PAGADO|PUBLICADA|PRESENTE|JUSTIFICADA|LEÍDA|COMPLETADA)$/.test(state) ? 'success'
    : /REJECT|ABSENT|CANCEL|BLOCK|RECHAZ|AUSENTE|FALTA/.test(state) ? 'danger'
    : /PENDING|OBSERVED|LATE|REVIEW|PENDIENT|OBSERV|TARDAN|REVISIÓN|SIN LEER/.test(state) ? 'warning' : 'neutral'
  return <span className="institutional-badge" data-tone={tone}>{children ?? value ?? '—'}</span>
}
