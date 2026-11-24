import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TreasuryDashboard from '../src/treasury/TreasuryDashboard'
import { deferred, makeUser, renderWithSession } from './helpers'
import type { Call, Reply } from './helpers'

const viewer = makeUser(['payments.view'])
const count = (index: number) => screen.getByTestId('treasury-count-' + index).textContent
const card = (name: string) => screen.getByRole('region', { name })
const paymentsByStatus = (totals: Record<string, unknown>) => (call: Call): Reply => ({ body: { meta: { total: totals[call.query.get('status') ?? 'ALL'] } } })

describe('TreasuryDashboard', () => {
  it('no consulta nada y muestra el aviso cuando falta payments.view', async () => {
    const { api } = renderWithSession(<TreasuryDashboard />, { user: makeUser(['payments.create']) })

    expect((await screen.findByRole('alert')).textContent).toBe('No tienes permiso para consultar pagos.')
    expect(api.calls.map(call => call.path)).toEqual(['/api/v1/auth/me'])
  })

  it('muestra los cuatro indicadores con los totales del servidor', async () => {
    const { api } = renderWithSession(<TreasuryDashboard />, {
      user: viewer,
      routes: {
        'GET /api/v1/student-payments': paymentsByStatus({ ALL: 12500, PENDING: 5, OVERDUE: 3, PAID: 100 }),
        'GET /api/v1/payment-concepts': { body: { total: 12 } },
      },
    })

    await waitFor(() => expect(count(0)).toBe((12500).toLocaleString('es-PE')))
    expect(count(1)).toBe('8')
    expect(count(2)).toBe('100')
    expect(count(3)).toBe('12')
    expect(within(card('Pagos pendientes')).getByText('Pendientes y vencidos')).toBeTruthy()
    expect(within(card('Pagos registrados')).getByText('Todos los estados')).toBeTruthy()
    expect(within(card('Pagos confirmados')).getByText('Registrados como pagados')).toBeTruthy()
    expect(within(card('Conceptos registrados')).getByText('Activos e inactivos')).toBeTruthy()
    expect(screen.queryByRole('alert')).toBeNull()

    const payments = api.to('GET', '/api/v1/student-payments')
    expect(payments.every(call => call.query.get('per_page') === '1')).toBe(true)
    expect(payments.map(call => call.query.get('status')).sort((a, b) => String(a).localeCompare(String(b)))).toEqual([null, 'OVERDUE', 'PAID', 'PENDING'])
    expect(api.to('GET', '/api/v1/payment-concepts')[0].query.get('per_page')).toBe('1')
  })

  it('indica la carga y bloquea la actualización hasta recibir respuesta', async () => {
    const gate = deferred<Reply>()
    renderWithSession(<TreasuryDashboard />, {
      user: viewer,
      routes: { 'GET /api/v1/student-payments': () => gate.promise, 'GET /api/v1/payment-concepts': () => gate.promise },
    })

    const refresh = await screen.findByRole('button', { name: /Actualizar resumen/ }) as HTMLButtonElement
    expect(refresh.disabled).toBe(true)
    expect(count(0)).toBe('—')
    expect(screen.getAllByText('Consultando…')).toHaveLength(4)
    expect(card('Pagos registrados').getAttribute('aria-busy')).toBe('true')

    gate.resolve({ body: { meta: { total: 2 } } })
    await waitFor(() => expect(refresh.disabled).toBe(false))
    expect(count(0)).toBe('2')
    expect(card('Pagos registrados').getAttribute('aria-busy')).toBe('false')
  })

  it('marca como no disponible un total con error o inválido sin ocultar los demás', async () => {
    renderWithSession(<TreasuryDashboard />, {
      user: viewer,
      routes: {
        'GET /api/v1/student-payments': call => {
          const status = call.query.get('status')
          if (status === 'PENDING' || status === 'OVERDUE') return { status: 500, body: { message: 'Servicio no disponible.' } }
          return { body: { meta: { total: status === 'PAID' ? -1 : 4 } } }
        },
        'GET /api/v1/payment-concepts': { body: { total: '7' } },
      },
    })

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toBe('No se pudo completar el resumen. Servicio no disponible.')
    expect(count(0)).toBe('4')
    for (const index of [1, 2, 3]) expect(count(index)).toBe('—')
    expect(within(card('Pagos pendientes')).getByText('Dato no disponible')).toBeTruthy()
    expect(within(card('Pagos confirmados')).getByText('Dato no disponible')).toBeTruthy()
    expect(within(card('Conceptos registrados')).getByText('Dato no disponible')).toBeTruthy()
  })

  it('trata un total decimal o una caída de red como dato no disponible', async () => {
    renderWithSession(<TreasuryDashboard />, {
      user: viewer,
      routes: {
        'GET /api/v1/student-payments': paymentsByStatus({ ALL: 1.5, PENDING: 1, OVERDUE: 1, PAID: 0 }),
        'GET /api/v1/payment-concepts': { network: true },
      },
    })

    expect((await screen.findByRole('alert')).textContent).toContain('No se pudo conectar con la plataforma.')
    expect(count(0)).toBe('—')
    expect(count(1)).toBe('2')
    expect(count(2)).toBe('0')
    expect(count(3)).toBe('—')
  })

  it('«Actualizar resumen» repite las cinco consultas y refresca los valores', async () => {
    const { api, routes } = renderWithSession(<TreasuryDashboard />, {
      user: viewer,
      routes: {
        'GET /api/v1/student-payments': paymentsByStatus({ ALL: 10, PENDING: 1, OVERDUE: 1, PAID: 8 }),
        'GET /api/v1/payment-concepts': { body: { meta: { total: 3 } } },
      },
    })
    await waitFor(() => expect(count(0)).toBe('10'))

    routes['GET /api/v1/student-payments'] = paymentsByStatus({ ALL: 11, PENDING: 2, OVERDUE: 1, PAID: 8 })
    fireEvent.click(screen.getByRole('button', { name: /Actualizar resumen/ }))

    await waitFor(() => expect(count(0)).toBe('11'))
    expect(count(1)).toBe('3')
    expect(api.to('GET', '/api/v1/student-payments')).toHaveLength(8)
    expect(api.to('GET', '/api/v1/payment-concepts')).toHaveLength(2)
  })

  it('enlaza cada indicador y acceso rápido con su sección de Tesorería', async () => {
    renderWithSession(<TreasuryDashboard />, {
      user: viewer,
      routes: { 'GET /api/v1/student-payments': { body: { meta: { total: 0 } } }, 'GET /api/v1/payment-concepts': { body: { meta: { total: 0 } } } },
    })
    await waitFor(() => expect(count(0)).toBe('0'))

    const hrefs = (name: RegExp) => screen.getAllByRole('link', { name }).map(link => link.getAttribute('href'))
    expect(hrefs(/Ver detalle/)).toEqual(['/app/treasury/payments', '/app/treasury/payments', '/app/treasury/history', '/app/treasury/concepts'])
    expect(hrefs(/Gestionar pagos|Conceptos de pago|Consultar historial/)).toEqual(['/app/treasury/payments', '/app/treasury/concepts', '/app/treasury/history'])
    expect(screen.getByRole('region', { name: 'Operaciones de Tesorería' })).toBeTruthy()
  })
})
