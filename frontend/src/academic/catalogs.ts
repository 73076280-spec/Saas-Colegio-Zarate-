export type FieldDefinition = { name: string; label: string; type?: 'text' | 'date' | 'number' | 'textarea' | 'checkbox'; required?: boolean; min?: number; max?: number; relation?: string }
export type Catalog = { title: string; singular: string; description: string; fields: FieldDefinition[]; filters: FieldDefinition[]; columns: { key: string; label: string }[] }
const name: FieldDefinition = { name: 'name', label: 'Nombre', required: true }
const code: FieldDefinition = { name: 'code', label: 'Código', required: true }
const dates: FieldDefinition[] = [{ name: 'start_date', label: 'Fecha de inicio', type: 'date', required: true }, { name: 'end_date', label: 'Fecha de fin', type: 'date', required: true }]
const year: FieldDefinition = { name: 'academic_year_id', label: 'Año académico', relation: 'academic-years', required: true }
const level: FieldDefinition = { name: 'education_level_id', label: 'Nivel educativo', relation: 'education-levels', required: true }
const grade: FieldDefinition = { name: 'grade_level_id', label: 'Grado', relation: 'grade-levels', required: true }
const order: FieldDefinition = { name: 'sort_order', label: 'Orden', type: 'number', min: 0, max: 65535 }
export const catalogs: Record<string, Catalog> = {
  'academic-years': { title: 'Años académicos', singular: 'año académico', description: 'Organiza el calendario y define el año actual de la institución.',
    fields: [name, ...dates, { name: 'is_current', label: 'Establecer como año actual', type: 'checkbox' }], filters: [],
    columns: [{ key: 'start_date', label: 'Inicio' }, { key: 'end_date', label: 'Fin' }, { key: 'is_current', label: 'Actual' }] },
  'academic-periods': { title: 'Periodos', singular: 'periodo', description: 'Define periodos dentro de las fechas del año, sin solapamientos.',
    fields: [year, name, { name: 'sequence', label: 'Secuencia', type: 'number', required: true, min: 1, max: 65535 }, ...dates, { name: 'grading_open', label: 'Permitir edición de notas en módulos futuros', type: 'checkbox' }],
    filters: [year], columns: [{ key: 'academic_year', label: 'Año' }, { key: 'sequence', label: 'Secuencia' }, { key: 'start_date', label: 'Inicio' }, { key: 'end_date', label: 'Fin' }, { key: 'grading_open', label: 'Edición de notas' }] },
  'education-levels': { title: 'Niveles educativos', singular: 'nivel educativo', description: 'Estructura los niveles educativos de tu institución.',
    fields: [name, code, order], filters: [], columns: [{ key: 'code', label: 'Código' }, { key: 'sort_order', label: 'Orden' }] },
  'grade-levels': { title: 'Grados', singular: 'grado', description: 'Organiza los grados dentro de cada nivel educativo.',
    fields: [level, name, code, order], filters: [level], columns: [{ key: 'education_level', label: 'Nivel' }, { key: 'code', label: 'Código' }, { key: 'sort_order', label: 'Orden' }] },
  sections: { title: 'Secciones', singular: 'sección', description: 'Secciones por año académico y grado, con capacidad opcional.',
    fields: [year, grade, name, { name: 'capacity', label: 'Capacidad (opcional)', type: 'number', min: 1, max: 100000 }],
    filters: [year, grade], columns: [{ key: 'academic_year', label: 'Año' }, { key: 'grade_level', label: 'Grado' }, { key: 'capacity', label: 'Capacidad' }] },
  subjects: { title: 'Asignaturas', singular: 'asignatura', description: 'Catálogo institucional de asignaturas. Las desactivadas conservan su historial.',
    fields: [name, code, { name: 'description', label: 'Descripción', type: 'textarea' }], filters: [],
    columns: [{ key: 'code', label: 'Código' }, { key: 'description', label: 'Descripción' }] },
}
export type AcademicEntry = { id: number; name: string; status: string; periods?: AcademicEntry[]; [key: string]: unknown }
export type AcademicList = { data: AcademicEntry[]; current_page: number; last_page: number; total: number }
export const statusLabels: Record<string, string> = { ACTIVE: 'Activo', INACTIVE: 'Inactivo', DRAFT: 'Borrador', CLOSED: 'Cerrado' }
export function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  if (typeof value === 'object' && 'name' in value) {
    const entry = value as AcademicEntry
    return entry.education_level ? String(entry.name) + ' · ' + displayValue(entry.education_level) : String(entry.name)
  }
  return String(value)
}
