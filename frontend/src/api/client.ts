export class ApiError extends Error {
  status: number
  errors: Record<string, string[]>
  constructor(status: number, message: string, errors: Record<string, string[]> = {}) {
    super(message)
    this.status = status
    this.errors = errors
  }
}
export async function api<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const csrf = document.cookie.split('; ').find(value => value.startsWith('XSRF-TOKEN='))?.slice(11)
  const response = await fetch(path, {
    method, credentials: 'include', headers: {
      Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest',
      ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(csrf ? { 'X-XSRF-TOKEN': decodeURIComponent(csrf) } : {}),
    }, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  })
  if (response.status === 204) return undefined as T
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (response.status === 401 || response.status === 419) window.dispatchEvent(new Event('session-expired'))
    throw new ApiError(response.status, response.status === 429 ? 'Demasiados intentos. Espera un minuto y vuelve a intentar.' : data.message || 'No se pudo completar la solicitud.', data.errors)
  }
  return data as T
}
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const fields = Object.values(error.errors).flat()
    return fields.length ? fields.join(' ') : error.message
  }
  return 'No se pudo conectar con la plataforma. Comprueba que el servicio esté disponible.'
}
