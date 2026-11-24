import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import EnrollmentForm from '../src/enrollment/EnrollmentForm'
import type { Enrollment } from '../src/enrollment/EnrollmentsPage'
import { deferred, makeUser, page, renderWithSession } from './helpers'
import type { Call, Reply, Routes } from './helpers'

const OPTIONS = '/api/v1/enrollment-options'
const ENROLLMENTS = '/api/v1/enrollments'
const catalog: Record<string, unknown[]> = {
  students: [{ id: 7, name: 'Ana Torres' }, { id: 8, name: 'Luis Pérez' }],
  years: [{ id: 2, name: '2027' }, { id: 3, name: '2028' }],
  grades: [{ id: 4, name: '3.º Primaria' }],
  sections: [
    { id: 11, name: 'A', capacity: 30, occupied: 28 },
    { id: 12, name: 'B', capacity: null },
    { id: 13, name: 'C', capacity: 20 },
    { id: 14, name: 'D', capacity: 10, occupied: 12 },
  ],
}
const saved: Enrollment = {
  id: 99, enrollment_code: 'MAT-2027-0099', student_id: 7, academic_year_id: 2, grade_level_id: 4, section_id: 11, status: 'DRAFT', observations: null, enrolled_at: null,
  student: { name: 'Ana Torres' }, academic_year: { name: '2027' }, grade_level: { name: '3.º Primaria', level: 'PRIMARY' }, section: { name: 'A', capacity: 30 },
}
const existing: Enrollment = { ...saved, id: 50, enrollment_code: 'MAT-2027-0050', status: 'OBSERVED', observations: 'Documentos pendientes' }
const guardians = [
  { id: 1, guardian: { name: 'Marta Ruiz' }, relationship: 'MOTHER', is_primary: true },
  { id: 2, guardian: { name: 'Pedro Gil' }, relationship: 'AUNT', is_primary: false },
]
const baseRoutes = (extra: Routes = {}): Routes => ({
  ['GET ' + OPTIONS]: (call: Call): Reply => ({ body: page(catalog[call.query.get('kind') ?? ''] ?? []) }),
  ...extra,
})

async function renderForm({ permissions = ['enrollments.create'], record = null, routes = {} }: { permissions?: string[]; record?: Enrollment | null; routes?: Routes } = {}) {
  const onSaved = vi.fn(), onCancel = vi.fn()
  const view = renderWithSession(<EnrollmentForm record={record} onSaved={onSaved} onCancel={onCancel} />, { user: makeUser(permissions), routes: baseRoutes(routes) })
  await screen.findByTestId('enrollment-wizard')
  return { ...view, onSaved, onCancel }
}
// Los Pager de cada Lookup también dicen «Siguiente»/«Anterior»: los botones del asistente son los que no están en un fieldset.
const wizard = (name: string) => screen.getAllByRole('button', { name }).find(button => !button.closest('fieldset')) as HTMLButtonElement
const pagerNext = () => screen.getAllByRole('button', { name: 'Siguiente' }).find(button => button.getAttribute('type') === 'button') as HTMLButtonElement
const stepTitle = () => screen.getByRole('heading', { level: 3 }).textContent
const pick = async (label: string, optionName: string, value: string) => {
  await screen.findByRole('option', { name: optionName })
  fireEvent.change(screen.getByRole('combobox', { name: label }), { target: { value } })
}
const chooseStudent = async () => { await pick('Estudiante', 'Ana Torres', '7'); fireEvent.click(wizard('Siguiente')) }
const chooseAcademic = async (section = ['11', 'A — 28/30 estudiantes']) => {
  await pick('Año académico', '2027', '2')
  await pick('Grado', '3.º Primaria', '4')
  await pick('Sección', section[1], section[0])
}
async function reachReview(observations = '') {
  await chooseStudent()
  fireEvent.click(wizard('Siguiente'))
  await chooseAcademic()
  if (observations) fireEvent.change(screen.getByLabelText('Observaciones'), { target: { value: observations } })
  fireEvent.click(wizard('Siguiente'))
  expect(stepTitle()).toBe('Paso 4 de 5: Revisión de la solicitud')
}

describe('EnrollmentForm · paso 1: estudiante', () => {
  it('exige elegir un estudiante, anuncia el error y enfoca el campo disponible', async () => {
    const gate = deferred<Reply>()
    await renderForm({ routes: { ['GET ' + OPTIONS]: () => gate.promise } })
    expect(screen.getByRole('heading', { name: 'Nueva matrícula' })).toBeTruthy()
    expect(stepTitle()).toBe('Paso 1 de 5: Datos del estudiante')

    fireEvent.click(wizard('Siguiente'))
    expect((await screen.findByRole('alert')).textContent).toBe('Selecciona una opción para continuar.')
    expect(stepTitle()).toBe('Paso 1 de 5: Datos del estudiante')
    await waitFor(() => expect(document.activeElement?.id).toBe('student_id-search'))

    gate.resolve({ body: page(catalog.students) })
    await screen.findByRole('option', { name: 'Ana Torres' })
    fireEvent.submit(screen.getByTestId('enrollment-wizard'))
    const select = screen.getByRole('combobox', { name: 'Estudiante' })
    await waitFor(() => expect(document.activeElement).toBe(select))
    expect(select.getAttribute('aria-invalid')).toBe('true')
    expect(select.getAttribute('aria-describedby')).toBe('student_id-error')

    fireEvent.change(select, { target: { value: '7' } })
    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.getByText('Estudiante seleccionado: Ana Torres. Se utilizará su registro existente.')).toBeTruthy()
  })

  it('marca el paso actual en el indicador de progreso', async () => {
    await renderForm()

    const items = within(screen.getByRole('list', { name: 'Progreso de matrícula' })).getAllByRole('listitem')
    expect(items.map(item => item.getAttribute('aria-current'))).toEqual(['step', null, null, null, null])
    expect(items[4].textContent).toBe('5. Confirmación')
  })

  it('busca estudiantes con retardo, pagina las opciones y reinicia la página al buscar', async () => {
    const { api } = await renderForm({ routes: { ['GET ' + OPTIONS]: call => ({ body: page(catalog.students, Number(call.query.get('page')), 2) }) } })
    await screen.findByRole('option', { name: 'Ana Torres' })

    fireEvent.click(within(screen.getByRole('group', { name: 'Estudiante' })).getByRole('button', { name: 'Siguiente' }))
    await screen.findByText('Página 2 de 2')
    fireEvent.change(screen.getByRole('textbox', { name: 'Buscar Estudiante' }), { target: { value: 'Ana' } })

    await waitFor(() => expect(api.to('GET', OPTIONS).at(-1)?.query.get('search')).toBe('Ana'))
    const last = api.to('GET', OPTIONS).at(-1)!
    expect(last.query.get('kind')).toBe('students')
    expect(last.query.get('page')).toBe('1')
    expect(last.query.has('academic_year_id')).toBe(false)
  })

  it('informa cuando el catálogo está vacío o falla', async () => {
    const empty = await renderForm({ routes: { ['GET ' + OPTIONS]: { body: page([]) } } })
    expect(await screen.findByText('No hay opciones para esta consulta.')).toBeTruthy()
    expect(screen.getByRole('status').tagName).toBe('P')
    empty.unmount()

    await renderForm({ routes: { ['GET ' + OPTIONS]: { status: 500, body: { message: 'Catálogo no disponible.' } } } })
    expect((await screen.findByRole('alert')).textContent).toBe('Catálogo no disponible.')
  })

  it('muestra «Cargando opciones…» mientras responde el catálogo', async () => {
    const gate = deferred<Reply>()
    await renderForm({ routes: { ['GET ' + OPTIONS]: () => gate.promise } })

    expect(await screen.findByText('Cargando opciones…')).toBeTruthy()
    expect((screen.getByRole('combobox', { name: 'Estudiante' }) as HTMLSelectElement).disabled).toBe(true)
    gate.resolve({ body: page(catalog.students) })
    await screen.findByRole('option', { name: 'Ana Torres' })
    expect(screen.queryByText('Cargando opciones…')).toBeNull()
  })
})

describe('EnrollmentForm · paso 2: apoderado', () => {
  it('avanza al paso 2, enfoca el título y avisa si falta el permiso de apoderados', async () => {
    const { api } = await renderForm()
    await chooseStudent()

    expect(stepTitle()).toBe('Paso 2 de 5: Información del apoderado')
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('heading', { level: 3 })))
    expect(screen.getByText('La consulta de apoderados requiere un permiso adicional. Puedes continuar sin este dato.')).toBeTruthy()
    expect(api.calls.some(call => call.path.endsWith('/guardians'))).toBe(false)
    expect(within(screen.getByRole('list', { name: 'Progreso de matrícula' })).getAllByRole('listitem')[1].getAttribute('aria-current')).toBe('step')
  })

  it('lista los apoderados vinculados con su parentesco y pagina la consulta', async () => {
    const gate = deferred<Reply>()
    const { api } = await renderForm({ permissions: ['enrollments.create', 'student-guardians.view'], routes: { ['GET /api/v1/students/7/guardians']: call => call.query.get('page') === '1' ? gate.promise : { body: page([], 2, 2) } } })
    await chooseStudent()

    expect(await screen.findByText('Cargando vínculos familiares…')).toBeTruthy()
    gate.resolve({ body: page(guardians, 1, 2) })
    expect(await screen.findByText('Marta Ruiz · Madre · Principal')).toBeTruthy()
    expect(screen.getByText('Pedro Gil · AUNT')).toBeTruthy()

    fireEvent.click(pagerNext())
    expect(await screen.findByText('No hay apoderados vinculados en esta consulta. Puedes continuar.')).toBeTruthy()
    expect(api.to('GET', '/api/v1/students/7/guardians').map(call => call.query.get('page'))).toEqual(['1', '2'])
  })

  it('permite continuar aunque la consulta de apoderados falle', async () => {
    await renderForm({ permissions: ['enrollments.create', 'student-guardians.view'], routes: { ['GET /api/v1/students/7/guardians']: { status: 500, body: { message: 'Servicio de familia caído.' } } } })
    await chooseStudent()

    expect((await screen.findByRole('alert')).textContent).toBe('Servicio de familia caído. Puedes continuar; el guardado no exige consultar al apoderado.')
    fireEvent.click(wizard('Siguiente'))
    expect(stepTitle()).toBe('Paso 3 de 5: Datos académicos')
  })

  it('«Anterior» regresa al paso previo y limpia el aviso', async () => {
    await renderForm()
    await chooseStudent()

    fireEvent.click(wizard('Anterior'))

    expect(stepTitle()).toBe('Paso 1 de 5: Datos del estudiante')
    expect(screen.getAllByRole('button', { name: 'Anterior' }).every(button => button.closest('fieldset'))).toBe(true)
  })
})

describe('EnrollmentForm · paso 3: datos académicos', () => {
  it('encadena año, grado y sección, valida lo obligatorio y muestra la capacidad informativa', async () => {
    const years = deferred<Reply>()
    const { api } = await renderForm({ routes: { ['GET ' + OPTIONS]: call => call.query.get('kind') === 'years' ? years.promise : { body: page(catalog[call.query.get('kind') ?? ''] ?? []) } } })
    await chooseStudent()
    fireEvent.click(wizard('Siguiente'))
    expect(stepTitle()).toBe('Paso 3 de 5: Datos académicos')
    expect(screen.queryByRole('combobox', { name: 'Grado' })).toBeNull()

    fireEvent.click(wizard('Siguiente'))
    expect((await screen.findAllByRole('alert')).map(alert => alert.textContent)).toEqual(['Selecciona una opción para continuar.'])
    expect(stepTitle()).toBe('Paso 3 de 5: Datos académicos')
    await waitFor(() => expect(document.activeElement?.id).toBe('academic_year_id-search'))
    years.resolve({ body: page(catalog.years) })
    await screen.findByRole('option', { name: '2027' })

    await chooseAcademic()
    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.getByText('Capacidad: 30 · Ocupados: 28 · Disponibles: 2')).toBeTruthy()
    expect(screen.getByText('Los cupos son informativos; Laravel valida la disponibilidad al aprobar la matrícula.')).toBeTruthy()

    const section = screen.getByRole('combobox', { name: 'Sección' })
    fireEvent.change(section, { target: { value: '12' } })
    expect(screen.getByText('Capacidad: Sin límite · Ocupados: No disponible · Disponibles: Sin límite')).toBeTruthy()
    fireEvent.change(section, { target: { value: '13' } })
    expect(screen.getByText('Capacidad: 20 · Ocupados: No disponible · Disponibles: No disponible')).toBeTruthy()
    fireEvent.change(section, { target: { value: '14' } })
    expect(screen.getByText('Capacidad: 10 · Ocupados: 12 · Disponibles: 0')).toBeTruthy()

    const requests = api.to('GET', OPTIONS)
    const grades = requests.find(call => call.query.get('kind') === 'grades')!
    expect(grades.query.get('academic_year_id')).toBe('2')
    expect(grades.query.has('grade_level_id')).toBe(false)
    const sections = requests.find(call => call.query.get('kind') === 'sections')!
    expect([sections.query.get('academic_year_id'), sections.query.get('grade_level_id')]).toEqual(['2', '4'])
  })

  it('al cambiar el año reinicia grado y sección y oculta la capacidad', async () => {
    await renderForm()
    await chooseStudent()
    fireEvent.click(wizard('Siguiente'))
    await chooseAcademic()
    expect(screen.getByText(/^Capacidad:/)).toBeTruthy()

    fireEvent.change(screen.getByRole('combobox', { name: 'Año académico' }), { target: { value: '3' } })

    await screen.findByRole('combobox', { name: 'Grado' })
    expect((screen.getByRole('combobox', { name: 'Grado' }) as HTMLSelectElement).value).toBe('')
    expect(screen.queryByRole('combobox', { name: 'Sección' })).toBeNull()
    expect(screen.queryByText(/^Capacidad:/)).toBeNull()

    await pick('Grado', '3.º Primaria', '4')
    fireEvent.change(screen.getByRole('combobox', { name: 'Grado' }), { target: { value: '' } })
    expect(screen.queryByRole('combobox', { name: 'Sección' })).toBeNull()
  })

  it('explica cuando no hay secciones disponibles', async () => {
    await renderForm({ routes: { ['GET ' + OPTIONS]: call => ({ body: page(call.query.get('kind') === 'sections' ? [] : catalog[call.query.get('kind') ?? ''] ?? []) }) } })
    await chooseStudent()
    fireEvent.click(wizard('Siguiente'))
    await pick('Año académico', '2027', '2')
    await pick('Grado', '3.º Primaria', '4')

    expect(await screen.findByText('No hay secciones disponibles para esta consulta.')).toBeTruthy()
  })
})

describe('EnrollmentForm · revisión y confirmación', () => {
  it('resume los datos elegidos y guarda la matrícula como borrador', async () => {
    const { api, onSaved, onCancel } = await renderForm({ routes: { ['POST ' + ENROLLMENTS]: { status: 201, body: { data: saved } } } })
    await reachReview('Traslado desde otra sede')

    const summary = within(document.querySelector('dl') as HTMLElement)
    for (const [term, value] of [['Estudiante', 'Ana Torres'], ['Año académico', '2027'], ['Grado', '3.º Primaria'], ['Sección', 'A'], ['Observaciones', 'Traslado desde otra sede']]) {
      expect(summary.getByText(term).nextElementSibling?.textContent).toBe(value)
    }
    expect(screen.getByRole('heading', { name: 'Apoderados vinculados' })).toBeTruthy()
    expect(screen.getByText(/Se guardará un borrador\./)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Confirmar y guardar matrícula' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar matrícula' }))

    expect(await screen.findByText('Matrícula guardada correctamente: MAT-2027-0099.')).toBeTruthy()
    expect(api.to('POST', ENROLLMENTS)[0].body).toEqual({ student_id: 7, academic_year_id: 2, grade_level_id: 4, section_id: 11, observations: 'Traslado desde otra sede' })
    expect(stepTitle()).toBe('Paso 5 de 5: Confirmación')
    expect(screen.getByText('Borrador')).toBeTruthy()
    expect(screen.getByText(/El estado mostrado corresponde a la respuesta del servidor/)).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Confirmar y guardar matrícula' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Cerrar formulario' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Ver detalle' }))
    expect(onSaved).toHaveBeenCalledWith(saved)
    const list = screen.getByRole('link', { name: 'Ir al listado' })
    expect(list.getAttribute('href')).toBe('/app/enrollments/list')
    fireEvent.click(list)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('muestra «Sin observaciones» y bloquea el formulario mientras guarda, aceptando un solo envío', async () => {
    const gate = deferred<Reply>()
    const { api } = await renderForm({ routes: { ['POST ' + ENROLLMENTS]: () => gate.promise } })
    await reachReview()
    expect(within(document.querySelector('dl') as HTMLElement).getByText('Sin observaciones')).toBeTruthy()

    const form = screen.getByTestId('enrollment-wizard')
    fireEvent.submit(form)
    fireEvent.submit(form)

    await waitFor(() => expect(form.getAttribute('aria-busy')).toBe('true'))
    expect(screen.getByRole('button', { name: 'Guardando matrícula…' })).toBeTruthy()
    expect((wizard('Anterior')).disabled).toBe(true)
    expect((screen.getByRole('button', { name: 'Cerrar formulario' }) as HTMLButtonElement).disabled).toBe(true)
    expect(api.to('POST', ENROLLMENTS)).toHaveLength(1)

    gate.resolve({ status: 201, body: { data: saved } })
    await screen.findByText('Matrícula guardada correctamente: MAT-2027-0099.')
    expect(form.getAttribute('aria-busy')).toBe('false')
    fireEvent.submit(form)
    expect(api.to('POST', ENROLLMENTS)).toHaveLength(1)
  })

  it('vuelve al paso del estudiante cuando el servidor rechaza student_id', async () => {
    await renderForm({ routes: { ['POST ' + ENROLLMENTS]: { status: 422, body: { message: 'Datos inválidos.', errors: { student_id: ['El estudiante ya tiene matrícula en este año.'] } } } } })
    await reachReview()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar matrícula' }))

    await waitFor(() => expect(stepTitle()).toBe('Paso 1 de 5: Datos del estudiante'))
    expect((await screen.findAllByRole('alert')).map(alert => alert.textContent)).toEqual(['El estudiante ya tiene matrícula en este año.', 'El estudiante ya tiene matrícula en este año.'])
    expect(wizard('Siguiente').disabled).toBe(false)
  })

  it('vuelve a los datos académicos cuando el servidor rechaza la sección u otras observaciones', async () => {
    await renderForm({ routes: { ['POST ' + ENROLLMENTS]: { status: 422, body: { message: 'Datos inválidos.', errors: { section_id: ['La sección no tiene cupo.'], observations: ['Las observaciones son demasiado largas.'] } } } } })
    await reachReview()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar matrícula' }))

    await waitFor(() => expect(stepTitle()).toBe('Paso 3 de 5: Datos académicos'))
    const alerts = (await screen.findAllByRole('alert')).map(alert => alert.textContent)
    expect(alerts).toContain('Las observaciones son demasiado largas.')
    expect(alerts).toContain('La sección no tiene cupo. Las observaciones son demasiado largas.')
  })

  it('permanece en la revisión ante un error general, de red o de un campo desconocido', async () => {
    const { routes } = await renderForm({ routes: { ['POST ' + ENROLLMENTS]: { status: 500, body: { message: 'Error interno.' } } } })
    await reachReview()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar matrícula' }))
    expect((await screen.findByRole('alert')).textContent).toBe('Error interno.')
    expect(stepTitle()).toBe('Paso 4 de 5: Revisión de la solicitud')

    routes['POST ' + ENROLLMENTS] = { network: true }
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar matrícula' }))
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('No se pudo conectar con la plataforma.'))

    routes['POST ' + ENROLLMENTS] = { status: 422, body: { message: 'Datos inválidos.', errors: { other: ['Regla institucional.'] } } }
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar matrícula' }))
    await waitFor(() => expect(screen.getAllByRole('alert').map(alert => alert.textContent)).toContain('Regla institucional.'))
    expect(stepTitle()).toBe('Paso 4 de 5: Revisión de la solicitud')
  })

  it('«Cerrar formulario» invoca la cancelación', async () => {
    const { onCancel } = await renderForm()

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar formulario' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})

describe('EnrollmentForm · edición', () => {
  it('conserva los datos de la matrícula existente y la actualiza con PATCH', async () => {
    const { api, onSaved } = await renderForm({ record: existing, routes: { ['PATCH ' + ENROLLMENTS + '/50']: { body: { data: { ...existing, observations: 'Documentos completos' } } } } })

    expect(screen.getByRole('heading', { name: 'Editar matrícula' })).toBeTruthy()
    expect(screen.getByText('Estudiante: Ana Torres')).toBeTruthy()
    expect(screen.queryByRole('combobox', { name: 'Estudiante' })).toBeNull()
    fireEvent.click(wizard('Siguiente'))
    fireEvent.click(wizard('Siguiente'))
    expect(stepTitle()).toBe('Paso 3 de 5: Datos académicos')
    expect((screen.getByLabelText('Observaciones') as HTMLTextAreaElement).value).toBe('Documentos pendientes')
    expect(screen.getByRole('option', { name: 'Selección actual #2' })).toBeTruthy()
    fireEvent.change(screen.getByLabelText('Observaciones'), { target: { value: 'Documentos completos' } })
    fireEvent.click(wizard('Siguiente'))

    expect(screen.getByText(/Se guardarán los cambios conservando el estado actual\./)).toBeTruthy()
    const summary = within(document.querySelector('dl') as HTMLElement)
    expect(summary.getByText('Sección').nextElementSibling?.textContent).toBe('A')
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar matrícula' }))

    await screen.findByText('Matrícula guardada correctamente: MAT-2027-0050.')
    expect(api.to('PATCH', ENROLLMENTS + '/50')[0].body).toEqual({ student_id: 7, academic_year_id: 2, grade_level_id: 4, section_id: 11, observations: 'Documentos completos' })
    fireEvent.click(screen.getByRole('button', { name: 'Ver detalle' }))
    expect(onSaved).toHaveBeenCalledTimes(1)
  })
})
