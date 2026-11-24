import { fireEvent, screen, within } from '@testing-library/react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import TreasuryLayout, { LegacyPaymentsRedirect, treasuryLinks } from '../src/treasury/TreasuryLayout'
import { makeUser, renderWithSession } from './helpers'

function Location() {
  const { pathname, search } = useLocation()
  return <p data-testid="location">{pathname + search}</p>
}

const tree = (
  <>
    <Routes>
      <Route path="/app" element={<p>Panel institucional</p>} />
      <Route path="/app/treasury" element={<TreasuryLayout />}>
        <Route index element={<p>Resumen de prueba</p>} />
        <Route path="payments" element={<p>Pagos de prueba</p>} />
        <Route path="concepts" element={<p>Conceptos de prueba</p>} />
        <Route path="history" element={<p>Historial de prueba</p>} />
      </Route>
      <Route path="/app/payments" element={<LegacyPaymentsRedirect />} />
    </Routes>
    <Location />
  </>
)
const treasurer = makeUser(['payments.view'])

describe('TreasuryLayout', () => {
  it('bloquea el centro y su contenido sin payments.view', async () => {
    renderWithSession(tree, { user: makeUser(['payments.create']), entries: ['/app/treasury'] })

    expect((await screen.findByRole('alert')).textContent).toBe('No tienes permiso para acceder al Centro de Tesorería.')
    expect(screen.queryByRole('navigation', { name: 'Navegación de Tesorería' })).toBeNull()
    expect(screen.queryByText('Resumen de prueba')).toBeNull()
  })

  it('presenta la institución, la navegación accesible y el contenido del índice', async () => {
    renderWithSession(tree, { user: treasurer, entries: ['/app/treasury'] })

    const nav = await screen.findByRole('navigation', { name: 'Navegación de Tesorería' })
    expect(screen.getByTestId('treasury-center')).toBeTruthy()
    expect(screen.getByText('Gestión financiera')).toBeTruthy()
    expect(screen.getByText('Colegio de Prueba')).toBeTruthy()
    const links = within(nav).getAllByRole('link')
    expect(links.map(link => link.textContent)).toEqual(treasuryLinks.map(link => link.label))
    expect(links.map(link => link.getAttribute('href'))).toEqual(['/app/treasury', '/app/treasury/payments', '/app/treasury/concepts', '/app/treasury/history'])
    expect(links.map(link => link.getAttribute('aria-current'))).toEqual(['page', null, null, null])
    expect(within(screen.getByTestId('treasury-content')).getByText('Resumen de prueba')).toBeTruthy()
    expect(screen.getByRole('link', { name: /Volver a Gestión Institucional/ }).getAttribute('href')).toBe('/app')
  })

  it('cambia de sección sin recargar y marca solo el enlace activo', async () => {
    renderWithSession(tree, { user: treasurer, entries: ['/app/treasury'] })
    const nav = await screen.findByRole('navigation', { name: 'Navegación de Tesorería' })

    fireEvent.click(within(nav).getByRole('link', { name: 'Conceptos de pago' }))
    expect(await screen.findByText('Conceptos de prueba')).toBeTruthy()
    expect(within(nav).getByRole('link', { name: 'Conceptos de pago' }).getAttribute('aria-current')).toBe('page')
    expect(within(nav).getByRole('link', { name: 'Inicio' }).getAttribute('aria-current')).toBeNull()

    fireEvent.click(within(nav).getByRole('link', { name: 'Historial' }))
    expect(await screen.findByText('Historial de prueba')).toBeTruthy()
    expect(screen.getByTestId('location').textContent).toBe('/app/treasury/history')

    fireEvent.click(screen.getByRole('link', { name: /Volver a Gestión Institucional/ }))
    expect(await screen.findByText('Panel institucional')).toBeTruthy()
  })

  it('redirige la ruta anterior /app/payments conservando la query string', async () => {
    renderWithSession(tree, { user: treasurer, entries: ['/app/payments?status=PENDING'] })

    expect(await screen.findByText('Pagos de prueba')).toBeTruthy()
    expect(screen.getByTestId('location').textContent).toBe('/app/treasury/payments?status=PENDING')
  })
})
