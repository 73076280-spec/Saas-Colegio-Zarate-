import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError, errorMessage } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Message } from '../components/Form'
import { Lookup, Pager, Status } from './shared'
import type { Option, Page } from './shared'
import type { Enrollment } from './EnrollmentsPage'
import { familyLabels } from '../people/config'

type Family = { id:number; guardian:{name:string}; relationship:string; is_primary:boolean }
const steps = ['Datos del estudiante', 'Información del apoderado', 'Datos académicos', 'Revisión de la solicitud', 'Confirmación']
export default function EnrollmentForm({record,onSaved,onCancel}:{record:Enrollment|null;onSaved:(e:Enrollment)=>void;onCancel:()=>void}) {
 const {user}=useAuth()
 const [step,setStep]=useState(0),[student,setStudent]=useState(String(record?.student_id??'')),[year,setYear]=useState(String(record?.academic_year_id??'')),[grade,setGrade]=useState(String(record?.grade_level_id??'')),[section,setSection]=useState(String(record?.section_id??'')),[observations,setObservations]=useState(record?.observations??'')
 const [names,setNames]=useState<Record<string,string>>({student:record?.student.name??'',year:record?.academic_year.name??'',grade:record?.grade_level.name??'',section:record?.section.name??''})
 const [capacity,setCapacity]=useState<Option>(),[errors,setErrors]=useState<Record<string,string[]>>({}),[error,setError]=useState(''),[busy,setBusy]=useState(false),[saved,setSaved]=useState<Enrollment|null>(null)
 const lock=useRef(false),heading=useRef<HTMLHeadingElement>(null)
 const canFamily=!!user?.permissions.includes('student-guardians.view')
 const [familyPage,setFamilyPage]=useState(1),[family,setFamily]=useState<{key:string;result?:Page<Family>;error?:string}>({key:''})
 const familyKey=student+':'+familyPage
 useEffect(()=>{heading.current?.focus()},[step])
 useEffect(()=>{
  if(!student||!canFamily)return
  let alive=true
  api<Page<Family>>('/api/v1/students/'+student+'/guardians?page='+familyPage).then(result=>{if(alive)setFamily({key:familyKey,result})}).catch(e=>{if(alive)setFamily({key:familyKey,error:errorMessage(e)})})
  return()=>{alive=false}
 },[student,canFamily,familyPage,familyKey])
 const familyCurrent=family.key===familyKey
 function next(){
  const required=step===0?[['student_id',student]]:step===2?[['academic_year_id',year],['grade_level_id',grade],['section_id',section]]:[]
  const missing=Object.fromEntries(required.filter(([,v])=>!v).map(([k])=>[k,['Selecciona una opción para continuar.']]))
  setErrors(missing);setError('')
  if(Object.keys(missing).length){requestAnimationFrame(()=>{const name=Object.keys(missing)[0];const field=document.getElementById(name);(field instanceof HTMLSelectElement&&field.disabled?document.getElementById(name+'-search'):field)?.focus()});return}
  setStep(v=>v+1)
 }
 function lookup(label:string,name:string,kind:string,value:string,change:(v:string)=>void,key:string){return <div><Lookup key={name+':'+(kind==='grades'||kind==='sections'?year:'')+':'+(kind==='sections'?grade:'')} label={label} name={name} kind={kind} value={value} year={year} grade={grade} onChange={v=>{change(v);setErrors({});setError('')}} onSelect={o=>{setNames(n=>({...n,[key]:o?.name??''}));if(kind==='sections')setCapacity(o)}} invalid={!!errors[name]} errorId={errors[name]?name+'-error':undefined}/>{errors[name]&&<p id={name+'-error'} role="alert">{errors[name].join(' ')}</p>}</div>}
 const familySummary=<>{!canFamily?<p>La consulta de apoderados requiere un permiso adicional. Puedes continuar sin este dato.</p>:!familyCurrent?<p role="status">Cargando vínculos familiares…</p>:family.error?<Message error>{family.error+' Puedes continuar; el guardado no exige consultar al apoderado.'}</Message>:<><ul className="space-y-3">{family.result?.data.map(f=><li key={f.id} className="rounded-xl border border-beige p-3">{f.guardian.name} · {familyLabels[f.relationship]??f.relationship}{f.is_primary?' · Principal':''}</li>)}</ul>{!family.result?.data.length&&<p>No hay apoderados vinculados en esta consulta. Puedes continuar.</p>}<Pager page={family.result??null} onPage={setFamilyPage}/></>}</>
 return <form data-testid="enrollment-wizard" noValidate className="institutional-card my-6 space-y-5" aria-busy={busy} onSubmit={async e=>{
  e.preventDefault();if(step!==3){if(step<3)next();return}if(lock.current||saved)return
  lock.current=true;setBusy(true);setError('');setErrors({})
  try{const r=await api<{data:Enrollment}>('/api/v1/enrollments'+(record?'/'+record.id:''),record?'PATCH':'POST',{student_id:Number(student),academic_year_id:Number(year),grade_level_id:Number(grade),section_id:Number(section),observations});setSaved(r.data);setStep(4)}catch(e){setError(errorMessage(e));if(e instanceof ApiError){setErrors(e.errors);const keys=Object.keys(e.errors);if(keys.includes('student_id'))setStep(0);else if(keys.some(k=>['academic_year_id','grade_level_id','section_id','observations'].includes(k)))setStep(2)}}finally{setBusy(false);lock.current=false}
 }}>
 <h2 className="text-xl font-semibold">{record?'Editar matrícula':'Nueva matrícula'}</h2>
 <ol aria-label="Progreso de matrícula" className="grid gap-2 sm:grid-cols-5">{steps.map((name,i)=><li key={name} aria-current={step===i?'step':undefined} className={'rounded-xl border p-3 text-sm '+(step===i?'border-brown-medium bg-beige font-semibold':'border-beige')}>{i+1}. {name}</li>)}</ol>
 <h3 ref={heading} tabIndex={-1} className="text-lg font-semibold">Paso {step+1} de 5: {steps[step]}</h3>
 {step===0&&<>{record?<p>Estudiante: {record.student.name}</p>:lookup('Estudiante','student_id','students',student,v=>{setStudent(v);setFamilyPage(1)},'student')}{student&&<p className="rounded-xl bg-beige p-4">Estudiante seleccionado: {names.student}. Se utilizará su registro existente.</p>}</>}
 {step===1&&familySummary}
 {step===2&&<><div className="grid gap-4 md:grid-cols-2">{lookup('Año académico','academic_year_id','years',year,v=>{setYear(v);setGrade('');setSection('');setCapacity(undefined);setNames(n=>({...n,grade:'',section:''}))},'year')}{year&&lookup('Grado','grade_level_id','grades',grade,v=>{setGrade(v);setSection('');setCapacity(undefined);setNames(n=>({...n,section:''}))},'grade')}{year&&grade&&lookup('Sección','section_id','sections',section,setSection,'section')}</div>{section&&capacity&&<p role="status">Capacidad: {capacity.capacity??'Sin límite'} · Ocupados: {capacity.occupied??'No disponible'} · Disponibles: {capacity.capacity==null?'Sin límite':capacity.occupied===undefined?'No disponible':Math.max(0,capacity.capacity-capacity.occupied)}</p>}<p>Los cupos son informativos; Laravel valida la disponibilidad al aprobar la matrícula.</p><label className="grid gap-2" htmlFor="observations">Observaciones<textarea id="observations" className="institutional-field" name="observations" maxLength={2000} value={observations} aria-invalid={!!errors.observations} aria-describedby={errors.observations?'observations-error':undefined} onChange={e=>setObservations(e.target.value)}/></label>{errors.observations&&<p id="observations-error" role="alert">{errors.observations.join(' ')}</p>}</>}
 {step===3&&<><dl className="grid gap-4 sm:grid-cols-2">{[['Estudiante',names.student],['Año académico',names.year],['Grado',names.grade],['Sección',names.section],['Observaciones',observations||'Sin observaciones']].map(([label,value])=><div className="min-w-0 rounded-xl border border-beige p-4" key={label}><dt className="font-semibold">{label}</dt><dd className="break-words">{value}</dd></div>)}</dl><h4 className="font-semibold">Apoderados vinculados</h4>{familySummary}<p>{record?'Se guardarán los cambios conservando el estado actual.':'Se guardará un borrador. Después podrás enviarlo desde el detalle según tus permisos.'} Guardar no equivale a enviar ni aprobar.</p></>}
 <Message error>{error}</Message>
 {step===4&&saved?<><Message>Matrícula guardada correctamente: {saved.enrollment_code}.</Message><Status value={saved.status}/><p>El estado mostrado corresponde a la respuesta del servidor. El envío deja la solicitud pendiente de evaluación; la aprobación es una operación posterior.</p><div className="flex flex-wrap gap-3"><button type="button" className="institutional-button min-h-11" onClick={()=>onSaved(saved)}>Ver detalle</button><Link className="institutional-button min-h-11" to="/app/enrollments/list" onClick={onCancel}>Ir al listado</Link></div></>:<div className="flex flex-wrap gap-3">{step>0&&<button type="button" className="institutional-button min-h-11" disabled={busy} onClick={()=>{setStep(v=>v-1);setError('')}}>Anterior</button>}<button type="submit" className="institutional-button min-h-11" disabled={busy}>{busy?'Guardando matrícula…':step===3?'Confirmar y guardar matrícula':'Siguiente'}</button><button type="button" className="institutional-button min-h-11" disabled={busy} onClick={onCancel}>Cerrar formulario</button></div>}
 </form>
}
