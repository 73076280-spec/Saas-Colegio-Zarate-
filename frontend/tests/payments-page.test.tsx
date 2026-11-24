import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import PaymentsPage from '../src/enrollment/PaymentsPage'
import { deferred, makeUser, page, renderWithSession } from './helpers'
import type { Call, Reply, Routes } from './helpers'

const PAYMENTS = '/api/v1/student-payments'
const CONCEPTS = '/api/v1/payment-concepts'
const payment = (over: Record<string, unknown> = {}) => ({
  id: 5, student_id: 7, academic_year_id: 2, payment_concept_id: 3, amount: '350.00', due_date: '2027-03-31', paid_at: null, status: 'PENDING',
  observations: null, validator: null, student: { name: 'Ana Torres' }, concept: { name: 'Matrícula 2027' }, academic_year: { name: '2027' }, ...over,
})
const pending = payment()
const overdue = payment({ id: 6, student_id: 8, student: { name: 'Luis Pérez' }, due_date: '2027-02-01', status: 'OVERDUE' })
const paid = payment({ id: 9, student_id: 9, student: { name: 'Marta Ruiz' }, due_date: null, paid_at: '2027-03-10T15:00:00Z', status: 'PAID', validator: 'Rosa Vega' })
const concepts = [
  { id: 3, name: 'Matrícula 2027', code: 'MAT-2027', amount: '350.00', status: 'ACTIVE' },
  { id: 4, name: 'Pensión marzo', code: 'PEN-03', amount: '420.50', status: 'INACTIVE' },
]
const routesWith = (extra: Routes = {}): Routes => ({
  ['GET ' + PAYMENTS]: { body: page([pending, overdue, paid]) },
  ['GET ' + CONCEPTS]: { body: page(concepts) },
  'GET /api/v1/enrollment-options': (call: Call): Reply => ({ body: page(call.query.get('kind') === 'students' ? [{ id: 7, name: 'Ana Torres' }] : [{ id: 2, name: '2027' }]) }),
  ...extra,
})
const viewer = makeUser(['payments.view'])
const operator = makeUser(['payments.view', 'payments.update', 'payments.validate'])
const creator = makeUser(['payments.view', 'payments.create'])
const ready = () => screen.findByRole('row', { name: /Ana Torres/ })
const row = (name: string) => screen.getByRole('row', { name: new RegExp(name) })
const queries = (api: { to: (m: string, p: string) => Call[] }) => api.to('GET', PAYMENTS).map(call => call.query.toString())

describe('PaymentsPage · permisos', () => {
  it('no consulta pagos si el usuario carece de payments.view', async () => {
    const { api } = renderWithSession(<PaymentsPage />, { user: makeUser(['payments.create']), routes: routesWith() })

    expect((await screen.findByRole('alert')).textContent).toBe('No tienes permiso para consultar pagos.')
    expect(api.to('GET', PAYMENTS)).toHaveLength(0)
    expect(screen.queryByRole('button', { name: 'Registrar pago' })).toBeNull()
  })

  it('trata una sesión expirada como falta de permiso', async () => {
    renderWithSession(<PaymentsPage />, { user: null, routes: routesWith() })

    expect((await screen.findByRole('alert')).textContent).toBe('No tienes permiso para consultar pagos.')
  })

  it('con solo payments.view lista los pagos sin acciones de edición ni validación', async () => {
    renderWithSession(<PaymentsPage />, { user: viewer, routes: routesWith() })

    await ready()
    expect(screen.getByRole('table', { name: 'Pagos de la institución' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Tesorería' })).toBeTruthy()
    expect(screen.getByRole('columnheader', { name: 'Acciones' })).toBeTruthy()
    for (const name of ['Editar pago', 'Validar pago', 'Registrar pago', 'Nuevo concepto']) expect(screen.queryByRole('button', { name })).toBeNull()
  })

  it('con update pero sin validate solo ofrece editar los pagos pendientes o vencidos', async () => {
    renderWithSession(<PaymentsPage />, { user: makeUser(['payments.view', 'payments.update']), routes: routesWith() })

    await ready()
    expect(screen.getAllByRole('button', { name: 'Editar pago' })).toHaveLength(2)
    expect(screen.queryByRole('button', { name: 'Validar pago' })).toBeNull()
  })
})

describe('PaymentsPage · listado', () => {
  it('anuncia la carga con <output> y luego muestra monto, estado, fechas y validador', async () => {
    const gate = deferred<Reply>()
    renderWithSession(<PaymentsPage />, { user: viewer, routes: routesWith({ ['GET ' + PAYMENTS]: () => gate.promise }) })

    const loading = await screen.findByText('Cargando pagos…')
    expect(loading.tagName).toBe('OUTPUT')

    gate.resolve({ body: page([pending, overdue, paid]) })
    await ready()
    expect(screen.queryByText('Cargando pagos…')).toBeNull()
    const first = within(row('Ana Torres'))
    expect(first.getByText('Matrícula 2027 / 2027')).toBeTruthy()
    expect(first.getByText('350.00')).toBeTruthy()
    expect(first.getByText('2027-03-31')).toBeTruthy()
    const settled = within(row('Marta Ruiz'))
    expect(settled.getByText('Pagado')).toBeTruthy()
    expect(settled.getByText('2027-03-10')).toBeTruthy()
    expect(settled.getByText('Rosa Vega')).toBeTruthy()
    expect(settled.getByText('—', { selector: 'td' })).toBeTruthy()
  })

  it('usa el título «Pagos» dentro del centro de Tesorería', async () => {
    renderWithSession(<PaymentsPage center />, { user: viewer, routes: routesWith() })

    expect(await screen.findByRole('heading', { name: 'Pagos' })).toBeTruthy()
    expect(screen.getByText('Registro y validación con los permisos financieros existentes.')).toBeTruthy()
  })

  it('informa cuando no hay pagos para la consulta', async () => {
    renderWithSession(<PaymentsPage />, { user: viewer, routes: routesWith({ ['GET ' + PAYMENTS]: { body: page([]) } }) })

    expect(await screen.findByText('No hay pagos para esta consulta.')).toBeTruthy()
    expect(screen.queryByText('Cargando pagos…')).toBeNull()
  })

  it('muestra el mensaje del servidor cuando la consulta falla', async () => {
    renderWithSession(<PaymentsPage />, { user: viewer, routes: routesWith({ ['GET ' + PAYMENTS]: { status: 403, body: { message: 'Acceso denegado a pagos.' } } }) })

    expect((await screen.findByRole('alert')).textContent).toBe('Acceso denegado a pagos.')
    expect(screen.queryByText('Cargando pagos…')).toBeNull()
  })

  it('muestra un aviso genérico si no hay conexión', async () => {
    renderWithSession(<PaymentsPage />, { user: viewer, routes: routesWith({ ['GET ' + PAYMENTS]: { network: true } }) })

    expect((await screen.findByRole('alert')).textContent).toContain('No se pudo conectar con la plataforma.')
  })
})

describe('PaymentsPage · filtros y paginación', () => {
  it('busca por estudiante, pagina y reinicia la página al cambiar el estado', async () => {
    const { api } = renderWithSession(<PaymentsPage />, { user: viewer, routes: routesWith({ ['GET ' + PAYMENTS]: call => ({ body: page([pending], Number(call.query.get('page')), 3) }) }) })
    await ready()
    expect(queries(api)).toEqual(['page=1&search=&status='])

    fireEvent.change(screen.getByRole('textbox', { name: 'Buscar pago' }), { target: { value: 'Ana' } })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))
    await waitFor(() => expect(queries(api)).toHaveLength(2))
    expect(queries(api)[1]).toBe('page=1&search=Ana&status=')

    fireEvent.click(await screen.findByRole('button', { name: 'Siguiente' }))
    await screen.findByText('Página 2 de 3')
    expect(queries(api)[2]).toBe('page=2&search=Ana&status=')

    fireEvent.change(screen.getByRole('combobox', { name: 'Estado de pago' }), { target: { value: 'PAID' } })
    await waitFor(() => expect(queries(api)).toHaveLength(4))
    expect(queries(api)[3]).toBe('page=1&search=Ana&status=PAID')
    expect(screen.getAllByRole('option').map(option => option.textContent)).toEqual(['Todos los estados', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED'])
  })

  it('toma el estado inicial de la query string', async () => {
    const { api } = renderWithSession(<PaymentsPage />, { user: viewer, routes: routesWith(), entries: ['/?status=OVERDUE'] })

    await ready()
    expect(queries(api)).toEqual(['page=1&search=&status=OVERDUE'])
    expect((screen.getByRole('combobox', { name: 'Estado de pago' }) as HTMLSelectElement).value).toBe('OVERDUE')
  })

  it('los accesos «Pagos» y «Validaciones» fijan el filtro y reinician la página', async () => {
    const { api } = renderWithSession(<PaymentsPage />, { user: viewer, routes: routesWith({ ['GET ' + PAYMENTS]: call => ({ body: page([pending], Number(call.query.get('page')), 3) }) }) })
    await ready()
    fireEvent.click(await screen.findByText('Siguiente'))
    await screen.findByText('Página 2 de 3')

    expect(screen.getByRole('link', { name: 'Pagos' }).getAttribute('href')).toBe('/app/payments')
    fireEvent.click(screen.getByRole('link', { name: 'Validaciones' }))
    await waitFor(() => expect(queries(api).at(-1)).toBe('page=1&search=&status=PENDING'))
    expect((screen.getByRole('combobox', { name: 'Estado de pago' }) as HTMLSelectElement).value).toBe('PENDING')

    fireEvent.click(screen.getByRole('link', { name: 'Pagos' }))
    await waitFor(() => expect(queries(api).at(-1)).toBe('page=1&search=&status='))
  })

  it('en el centro de Tesorería los accesos apuntan a /app/treasury', async () => {
    renderWithSession(<PaymentsPage center />, { user: viewer, routes: routesWith() })

    await ready()
    expect(screen.getByRole('link', { name: 'Pagos' }).getAttribute('href')).toBe('/app/treasury/payments')
    expect(screen.getByRole('link', { name: 'Validaciones' }).getAttribute('href')).toBe('/app/treasury/payments?status=PENDING')
  })

  it('el historial es de solo lectura y arranca filtrado por pagados', async () => {
    const { api } = renderWithSession(<PaymentsPage view="history" center />, { user: makeUser(['payments.view', 'payments.create', 'payments.update', 'payments.validate']), routes: routesWith() })

    await ready()
    expect(screen.getByRole('table', { name: 'Historial de pagos de la institución' })).toBeTruthy()
    expect(queries(api)).toEqual(['page=1&search=&status=PAID'])
    expect(screen.getByRole('heading', { name: 'Historial de pagos' })).toBeTruthy()
    expect(screen.getByText('Consulta de pagos en modo de lectura. No representa un historial de cambios.')).toBeTruthy()
    expect(screen.queryByRole('columnheader', { name: 'Acciones' })).toBeNull()
    for (const name of ['Editar pago', 'Validar pago', 'Registrar pago', 'Nuevo concepto']) expect(screen.queryByRole('button', { name })).toBeNull()
  })
})

describe('PaymentsPage · validar y editar pagos', () => {
  it('pide confirmación antes de validar y solo envía la validación si se acepta', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true)
    const { api } = renderWithSession(<PaymentsPage />, { user: operator, routes: routesWith({ ['POST ' + PAYMENTS + '/5/validate']: { body: { data: {} } } }) })
    await ready()
    expect(within(row('Marta Ruiz')).queryByRole('button')).toBeNull()

    fireEvent.click(within(row('Ana Torres')).getByRole('button', { name: 'Validar pago' }))
    expect(confirm).toHaveBeenCalledWith('Validar el pago de Ana Torres?')
    expect(api.to('POST', PAYMENTS + '/5/validate')).toHaveLength(0)

    fireEvent.click(within(row('Ana Torres')).getByRole('button', { name: 'Validar pago' }))
    await waitFor(() => expect(api.to('GET', PAYMENTS)).toHaveLength(2))
    expect(api.to('POST', PAYMENTS + '/5/validate')).toHaveLength(1)
    expect(api.to('POST', PAYMENTS + '/5/validate')[0].body).toEqual({})
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('bloquea las acciones mientras valida y muestra el error del servidor', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const gate = deferred<Reply>()
    renderWithSession(<PaymentsPage />, { user: operator, routes: routesWith({ ['POST ' + PAYMENTS + '/5/validate']: () => gate.promise }) })
    await ready()

    fireEvent.click(within(row('Ana Torres')).getByRole('button', { name: 'Validar pago' }))
    await waitFor(() => expect((within(row('Luis Pérez')).getByRole('button', { name: 'Validar pago' }) as HTMLButtonElement).disabled).toBe(true))

    gate.resolve({ status: 422, body: { message: 'El pago ya fue validado.' } })
    expect((await screen.findByRole('alert')).textContent).toBe('El pago ya fue validado.')
    expect((within(row('Luis Pérez')).getByRole('button', { name: 'Validar pago' }) as HTMLButtonElement).disabled).toBe(false)
  })

  it('edita un pago existente y envía solo los datos modificables', async () => {
    const { api } = renderWithSession(<PaymentsPage />, { user: operator, routes: routesWith({ ['PATCH ' + PAYMENTS + '/5']: { body: { data: {} } } }) })
    await ready()

    fireEvent.click(within(row('Ana Torres')).getByRole('button', { name: 'Editar pago' }))
    expect(screen.getByRole('heading', { name: 'Editar pago' })).toBeTruthy()
    expect(screen.getByText('Ana Torres · Matrícula 2027 · 2027')).toBeTruthy()
    expect(screen.queryByRole('combobox', { name: 'Estudiante' })).toBeNull()
    expect((screen.getByLabelText('Monto') as HTMLInputElement).value).toBe('350.00')
    await waitFor(() => expect(api.to('GET', CONCEPTS)).toHaveLength(1))

    fireEvent.change(screen.getByLabelText('Monto'), { target: { value: '400.00' } })
    fireEvent.change(screen.getByLabelText('Vencimiento'), { target: { value: '' } })
    fireEvent.change(screen.getByRole('combobox', { name: 'Estado' }), { target: { value: 'OVERDUE' } })
    fireEvent.change(screen.getByLabelText('Observaciones'), { target: { value: 'Revisado' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar pago' }))

    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Editar pago' })).toBeNull())
    expect(api.to('PATCH', PAYMENTS + '/5')[0].body).toEqual({ student_id: 7, academic_year_id: 2, payment_concept_id: 3, amount: '400.00', due_date: null, status: 'OVERDUE', observations: 'Revisado' })
    await waitFor(() => expect(api.to('GET', PAYMENTS)).toHaveLength(2))
  })

  it('conserva el formulario y muestra el error de validación; «Cerrar formulario» lo descarta', async () => {
    renderWithSession(<PaymentsPage />, { user: operator, routes: routesWith({ ['PATCH ' + PAYMENTS + '/5']: { status: 422, body: { message: 'Datos inválidos.', errors: { amount: ['El monto es inválido.'] } } } }) })
    await ready()
    fireEvent.click(within(row('Ana Torres')).getByRole('button', { name: 'Editar pago' }))

    fireEvent.click(screen.getByRole('button', { name: 'Guardar pago' }))
    expect((await screen.findByRole('alert')).textContent).toBe('El monto es inválido.')
    expect(screen.getByRole('heading', { name: 'Editar pago' })).toBeTruthy()
    expect((screen.getByRole('button', { name: 'Guardar pago' }) as HTMLButtonElement).disabled).toBe(false)

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar formulario' }))
    expect(screen.queryByRole('heading', { name: 'Editar pago' })).toBeNull()
  })

  it('muestra el error de carga de conceptos dentro del formulario', async () => {
    renderWithSession(<PaymentsPage />, { user: operator, routes: routesWith({ ['GET ' + CONCEPTS]: { status: 500, body: { message: 'Catálogo no disponible.' } } }) })
    await ready()

    fireEvent.click(within(row('Ana Torres')).getByRole('button', { name: 'Editar pago' }))

    expect((await screen.findByRole('alert')).textContent).toBe('Catálogo no disponible.')
  })
})

describe('PaymentsPage · registrar pago y conceptos', () => {
  it('registra un pago nuevo y completa el monto con el del concepto activo elegido', async () => {
    const { api } = renderWithSession(<PaymentsPage />, { user: creator, routes: routesWith({ ['POST ' + PAYMENTS]: { status: 201, body: { data: {} } } }) })
    await ready()

    fireEvent.click(screen.getByRole('button', { name: 'Registrar pago' }))
    expect(screen.getByRole('heading', { name: 'Registrar pago' })).toBeTruthy()
    await screen.findByRole('option', { name: 'Ana Torres' })
    fireEvent.change(screen.getByRole('combobox', { name: 'Estudiante' }), { target: { value: '7' } })
    await screen.findByRole('option', { name: '2027' })
    fireEvent.change(screen.getByRole('combobox', { name: 'Año académico' }), { target: { value: '2' } })
    await screen.findByRole('option', { name: 'Matrícula 2027 — MAT-2027' })
    expect(screen.queryByRole('option', { name: /Pensión marzo/ })).toBeNull()

    const concept = screen.getByRole('combobox', { name: 'Concepto' })
    fireEvent.change(concept, { target: { value: '3' } })
    expect((screen.getByLabelText('Monto') as HTMLInputElement).value).toBe('350.00')
    fireEvent.change(concept, { target: { value: '' } })
    expect((screen.getByLabelText('Monto') as HTMLInputElement).value).toBe('')
    fireEvent.change(concept, { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar pago' }))

    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Registrar pago' })).toBeNull())
    expect(api.to('POST', PAYMENTS)[0].body).toEqual({ student_id: 7, academic_year_id: 2, payment_concept_id: 3, amount: '350.00', due_date: null, status: 'PENDING', observations: '' })
    await waitFor(() => expect(api.to('GET', PAYMENTS)).toHaveLength(2))
  })

  it('ofrece «Nuevo concepto» solo fuera del centro y lo abre y cierra con el mismo botón', async () => {
    renderWithSession(<PaymentsPage />, { user: creator, routes: routesWith() })
    await ready()

    const toggle = screen.getByRole('button', { name: 'Nuevo concepto' })
    fireEvent.click(toggle)
    expect(screen.getByRole('button', { name: 'Guardar concepto' })).toBeTruthy()
    fireEvent.click(toggle)
    expect(screen.queryByRole('button', { name: 'Guardar concepto' })).toBeNull()
  })

  it('en el centro de Tesorería no ofrece «Nuevo concepto» dentro de la vista de pagos', async () => {
    renderWithSession(<PaymentsPage center />, { user: creator, routes: routesWith() })
    await ready()

    expect(screen.getByRole('button', { name: 'Registrar pago' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Nuevo concepto' })).toBeNull()
  })

  it('crea un concepto y recarga el catálogo', async () => {
    const { api } = renderWithSession(<PaymentsPage view="concepts" center />, { user: creator, routes: routesWith({ ['POST ' + CONCEPTS]: { status: 201, body: { data: {} } } }) })
    await screen.findByRole('table', { name: 'Conceptos de pago de la institución' })
    expect(screen.getByRole('heading', { name: 'Conceptos de pago' })).toBeTruthy()
    expect(screen.getByText('Catálogo de conceptos e importes registrados en tu institución.')).toBeTruthy()
    expect(api.to('GET', PAYMENTS)).toHaveLength(0)
    expect(screen.queryByRole('button', { name: 'Registrar pago' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Validaciones' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Nuevo concepto' }))
    fireEvent.change(screen.getByLabelText('Nombre del concepto'), { target: { value: 'Taller de arte' } })
    fireEvent.change(screen.getByLabelText('Código'), { target: { value: 'TAL-1' } })
    fireEvent.change(screen.getByLabelText('Importe'), { target: { value: '15.50' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar concepto' }))

    await waitFor(() => expect(screen.queryByRole('button', { name: 'Guardar concepto' })).toBeNull())
    expect(api.to('POST', CONCEPTS)[0].body).toEqual({ name: 'Taller de arte', code: 'TAL-1', amount: '15.50' })
    await waitFor(() => expect(api.to('GET', CONCEPTS)).toHaveLength(2))
  })

  it('muestra el error al crear un concepto repetido y conserva el formulario', async () => {
    const gate = deferred<Reply>()
    renderWithSession(<PaymentsPage view="concepts" center />, { user: creator, routes: routesWith({ ['POST ' + CONCEPTS]: () => gate.promise }) })
    await screen.findByRole('table')
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo concepto' }))
    fireEvent.change(screen.getByLabelText('Nombre del concepto'), { target: { value: 'Matrícula 2027' } })
    fireEvent.change(screen.getByLabelText('Código'), { target: { value: 'MAT-2027' } })
    fireEvent.change(screen.getByLabelText('Importe'), { target: { value: '350' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar concepto' }))

    await waitFor(() => expect((screen.getByRole('button', { name: 'Guardar concepto' }) as HTMLButtonElement).disabled).toBe(true))
    gate.resolve({ status: 422, body: { message: 'Datos inválidos.', errors: { code: ['El código ya existe.'] } } })

    expect((await screen.findByRole('alert')).textContent).toBe('El código ya existe.')
    expect((screen.getByRole('button', { name: 'Guardar concepto' }) as HTMLButtonElement).disabled).toBe(false)
  })

  it('abre el alta de concepto con ?create=1 solo si el usuario puede crear', async () => {
    const withPermission = renderWithSession(<PaymentsPage view="concepts" center />, { user: creator, routes: routesWith(), entries: ['/?create=1'] })
    await screen.findByRole('table')
    expect(screen.getByRole('button', { name: 'Guardar concepto' })).toBeTruthy()
    withPermission.unmount()

    renderWithSession(<PaymentsPage view="concepts" center />, { user: viewer, routes: routesWith(), entries: ['/?create=1'] })
    await screen.findByRole('table')
    expect(screen.queryByRole('button', { name: 'Guardar concepto' })).toBeNull()
  })
})
