import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { AuthProvider, useAuth } from '../src/auth/AuthContext'
import type { User } from '../src/auth/types'

export type Call = { method: string; path: string; query: URLSearchParams; body?: Record<string, unknown> }
export type Reply = { status?: number; body?: unknown; network?: boolean }
export type Handler = Reply | ((call: Call) => Reply | Promise<Reply>)
export type Routes = Record<string, Handler>

export function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>(done => { resolve = done })
  return { promise, resolve }
}

/** Sustituye únicamente `fetch`: no hay red, MySQL ni Laravel reales. */
export function mockApi(routes: Routes) {
  const calls: Call[] = []
  vi.stubGlobal('fetch', vi.fn(async (input: string, init: RequestInit = {}) => {
    const url = new URL(input, 'http://localhost')
    const method = (init.method ?? 'GET').toUpperCase()
    const call: Call = { method, path: url.pathname, query: url.searchParams, body: typeof init.body === 'string' ? JSON.parse(init.body) : undefined }
    calls.push(call)
    const handler = routes[method + ' ' + url.pathname]
    if (!handler) return reply({ status: 404, body: { message: 'Ruta no simulada: ' + method + ' ' + url.pathname } })
    const result = await (typeof handler === 'function' ? handler(call) : handler)
    if (result.network) throw new TypeError('Failed to fetch')
    return reply(result)
  }))
  return {
    calls,
    to: (method: string, path: string) => calls.filter(call => call.method === method && call.path === path),
  }
}

function reply({ status = 200, body = {} }: Reply) {
  return status === 204 ? new Response(null, { status }) : new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

export function makeUser(permissions: string[], overrides: Partial<User> = {}): User {
  return {
    id: 10, institution_id: 1, first_name: 'Rosa', last_name: 'Vega', name: 'Rosa Vega', email: 'rosa@example.test', phone: null, avatar_path: null,
    status: 'ACTIVE', must_change_password: false, roles: ['TREASURY'], permissions,
    institution: { id: 1, name: 'Colegio de Prueba', code: 'CDP' }, ...overrides,
  }
}

function SessionGate({ children }: Readonly<{ children: ReactNode }>) {
  const { loading } = useAuth()
  return loading ? null : <>{children}</>
}

type Options = { user: User | null; routes?: Routes; entries?: string[] }

/** Monta la UI con el AuthProvider real; la sesión sale de GET /api/v1/auth/me simulado. */
export function renderWithSession(ui: ReactElement, { user, routes = {}, entries = ['/'] }: Options) {
  const table: Routes = {
    'GET /api/v1/auth/me': user ? { body: { data: user } } : { status: 401, body: { message: 'No autenticado.' } },
    ...routes,
  }
  const api = mockApi(table)
  const wrap = (children: ReactElement) => <MemoryRouter initialEntries={entries}><AuthProvider><SessionGate>{children}</SessionGate></AuthProvider></MemoryRouter>
  const view = render(wrap(ui))
  return { ...view, api, routes: table, rerenderUi: (next: ReactElement) => view.rerender(wrap(next)) }
}

export const page = <T,>(data: T[], current = 1, last = 1) => ({ data, meta: { current_page: current, last_page: last } })
