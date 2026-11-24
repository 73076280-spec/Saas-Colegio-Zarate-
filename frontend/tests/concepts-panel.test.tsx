import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ConceptsPanel from '../src/treasury/ConceptsPanel'
import { deferred, makeUser, page, renderWithSession } from './helpers'
import type { Reply } from './helpers'

const viewer = makeUser(['payments.view'])
const concepts = [
  { id: 1, name: 'Matrícula 2027', code: 'MAT-2027', amount: '350.00', status: 'ACTIVE' },
  { id: 2, name: 'Pensión marzo', code: 'PEN-03', amount: '420.50', status: 'INACTIVE' },
]
const PATH = '/api/v1/payment-concepts'

describe('ConceptsPanel', () => {
  it('anuncia la carga con <output> y luego muestra el catálogo accesible', async () => {
    const gate = deferred<Reply>()
    renderWithSession(<ConceptsPanel revision={0} />, { user: viewer, routes: { ['GET ' + PATH]: () => gate.promise } })

    const loading = await screen.findByText('Cargando conceptos de pago…')
    expect(loading.tagName).toBe('OUTPUT')
    expect(screen.getByRole('status')).toBe(loading)
    const section = screen.getByRole('region', { name: 'Catálogo de conceptos de pago' })
    expect(section.getAttribute('aria-busy')).toBe('true')

    gate.resolve({ body: page(concepts) })
    const table = await screen.findByRole('table', { name: 'Conceptos de pago de la institución' })
    expect(screen.queryByText('Cargando conceptos de pago…')).toBeNull()
    expect(section.getAttribute('aria-busy')).toBe('false')
    expect(within(table).getAllByRole('columnheader').map(cell => cell.textContent)).toEqual(['Concepto', 'Código', 'Importe (PEN)', 'Estado'])
    const row = within(table).getByRole('row', { name: /Matrícula 2027/ })
    expect(within(row).getByRole('rowheader').textContent).toBe('Matrícula 2027')
    expect(within(row).getByText('MAT-2027')).toBeTruthy()
    expect(within(row).getByText('350.00')).toBeTruthy()
    expect(within(row).getByText('Activo')).toBeTruthy()
    expect(within(table).getByText('Inactivo')).toBeTruthy()
    expect(screen.getByText('Página 1 de 1')).toBeTruthy()
  })

  it('muestra un estado vacío cuando la búsqueda no devuelve conceptos', async () => {
    renderWithSession(<ConceptsPanel revision={0} />, { user: viewer, routes: { ['GET ' + PATH]: { body: page([]) } } })

    expect(await screen.findByText('No hay conceptos que coincidan con la búsqueda.')).toBeTruthy()
    expect(screen.getByText('Prueba con otros filtros o vuelve más adelante.')).toBeTruthy()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('busca por nombre solo al enviar y conserva la búsqueda al paginar', async () => {
    const { api } = renderWithSession(<ConceptsPanel revision={0} />, { user: viewer, routes: { ['GET ' + PATH]: call => ({ body: page(concepts, Number(call.query.get('page')), 3) }) } })
    await screen.findByRole('table')
    expect(api.to('GET', PATH)[0].query.toString()).toBe('page=1&search=')

    fireEvent.change(screen.getByLabelText('Buscar concepto'), { target: { value: 'Matr' } })
    expect(api.to('GET', PATH)).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Buscar conceptos' }))
    await waitFor(() => expect(api.to('GET', PATH)).toHaveLength(2))
    expect(api.to('GET', PATH)[1].query.toString()).toBe('page=1&search=Matr')

    fireEvent.click(await screen.findByRole('button', { name: 'Siguiente' }))
    await screen.findByText('Página 2 de 3')
    expect(api.to('GET', PATH)[2].query.toString()).toBe('page=2&search=Matr')
  })

  it('informa el error y permite reintentar la consulta', async () => {
    const { api, routes } = renderWithSession(<ConceptsPanel revision={0} />, { user: viewer, routes: { ['GET ' + PATH]: { status: 500, body: { message: 'No se pudo cargar el catálogo.' } } } })

    expect((await screen.findByRole('alert')).textContent).toBe('No se pudo cargar el catálogo.')
    expect(screen.queryByRole('table')).toBeNull()

    routes['GET ' + PATH] = { body: page(concepts) }
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar consulta' }))

    await screen.findByRole('table')
    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Reintentar consulta' })).toBeNull()
    expect(api.to('GET', PATH)).toHaveLength(2)
  })

  it('vuelve a consultar cuando cambia la revisión del padre', async () => {
    const { api, rerenderUi } = renderWithSession(<ConceptsPanel revision={0} />, { user: viewer, routes: { ['GET ' + PATH]: { body: page(concepts) } } })
    await screen.findByRole('table')

    rerenderUi(<ConceptsPanel revision={1} />)

    await waitFor(() => expect(api.to('GET', PATH)).toHaveLength(2))
    await screen.findByRole('table')
  })
})
