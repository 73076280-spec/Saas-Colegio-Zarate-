export async function fetchHealth(signal: AbortSignal): Promise<void> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
  const response = await fetch(`${baseUrl}/health`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
    signal,
  })
  if (!response.ok) throw new Error('El backend no está disponible.')
  const data: unknown = await response.json()
  if (
    typeof data !== 'object' || data === null ||
    !('status' in data) || data.status !== 'ok' ||
    !('service' in data) || data.service !== 'backend'
  ) throw new Error('Respuesta de salud no válida.')
}
