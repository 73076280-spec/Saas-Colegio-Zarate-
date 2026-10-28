import CourseLearning, { courseTabs } from '../learning/CourseLearning'
import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Message, PageHeading } from '../components/Form'
import { Lookup, Pager, Status } from '../enrollment/shared'
import type { Page } from '../enrollment/shared'
import TeachingForm from './TeachingForm'
import type { TeachingRecord } from './TeachingForm'
import CourseCards from './CourseCards'
type Roster={student_id:number;student_code:string;name:string;enrollment_code:string}
export function CourseRoster({id}:{id:number}) {
 const [page,setPage]=useState(1),[result,setResult]=useState<Page<Roster>|null>(null),[error,setError]=useState('')
 useEffect(()=>{let active=true;api<Page<Roster>>('/api/v1/courses/'+id+'/students?page='+page).then(r=>{if(active)setResult(r)}).catch(e=>{if(active)setError(errorMessage(e))});return()=>{active=false}},[id,page])
 return <section className="mt-5"><h3 className="text-lg font-semibold">Estudiantes matriculados</h3><Message error>{error}</Message>{!result&&!error&&<p role="status">Cargando estudiantes…</p>}<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">Código</th><th className="p-3">Estudiante</th><th className="p-3">Matrícula</th></tr></thead><tbody>{result?.data.map(s=><tr key={s.student_id} className="border-t border-beige"><td className="p-3">{s.student_code}</td><td className="p-3">{s.name}</td><td className="p-3">{s.enrollment_code}</td></tr>)}</tbody></table></div>{result?.data.length===0&&<p>No hay estudiantes con matrícula aprobada.</p>}<Pager page={result} onPage={setPage}/></section>
}
export default function TeachingPage({kind='courses',personal=false,virtualMode=false,courseSection='',heading}:{kind?:'courses'|'teacher-assignments';personal?:boolean;virtualMode?:boolean;courseSection?:string;heading?:string}) {
 const {user}=useAuth(),course=kind==='courses',can=(operation:string)=>user?.permissions.includes(kind+'.'+operation)
 const authorized=course||can('view')
 const [result,setResult]=useState<Page<TeachingRecord>|null>(null),[page,setPage]=useState(1),[revision,setRevision]=useState(0),[search,setSearch]=useState(''),[query,setQuery]=useState(''),[status,setStatus]=useState(''),[error,setError]=useState(''),[detail,setDetail]=useState<TeachingRecord|null>(null),[form,setForm]=useState<{record:TeachingRecord|null}|null>(null),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true)
 const [filters,setFilters]=useState({teacher_id:'',subject_id:'',academic_year_id:'',grade_level_id:'',section_id:''})
 useEffect(()=>{if(!authorized)return;let active=true
 const timer=setTimeout(()=>{setLoading(true);const params=new URLSearchParams({page:String(page),search:query,status,...Object.fromEntries(Object.entries(filters).filter(([,v])=>v))})
 api<Page<TeachingRecord>>('/api/v1/'+(personal?'my/courses':kind)+'?'+params).then(r=>{if(active){setResult(r);setError('')}}).catch(e=>{if(active)setError(errorMessage(e))}).finally(()=>{if(active)setLoading(false)})},0)
 return()=>{active=false;clearTimeout(timer)}
 },[kind,personal,page,revision,query,status,filters,authorized])
 async function show(id:number){setDetail(null);try{setDetail((await api<{data:TeachingRecord}>('/api/v1/'+kind+'/'+id)).data)}catch(e){setError(errorMessage(e))}}
 async function action(operation:string,body?:object){
 if(!detail||!window.confirm('Confirmar esta acción sobre '+(detail.name??'la asignación')+'?'))return
 setBusy(true);setError('')
 try{const r=await api<{data:TeachingRecord}>('/api/v1/'+kind+'/'+detail.id+(body?'':'/'+operation),body?'PATCH':'POST',body??{});setDetail(r.data);setRevision(v=>v+1)}catch(e){setError(errorMessage(e))}finally{setBusy(false)}
 }
 if(!authorized)return <Message error>No tienes permiso para consultar asignaciones.</Message>
 return <><PageHeading title={heading || (personal||virtualMode?'Mis cursos':course?'Cursos':'Asignación docente')} description={virtualMode?'Selecciona un curso autorizado para entrar a su aula.':personal?'Cursos autorizados de tu comunidad educativa.':'Organiza la docencia y los cursos de cada sección.'}/>
 {!virtualMode&&!personal&&can('create')&&<button className="institutional-button" onClick={()=>{setForm({record:null});setDetail(null)}}>{course?'Crear curso':'Crear asignación'}</button>}
 {form&&<TeachingForm kind={kind} record={form.record} onCancel={()=>setForm(null)} onSaved={r=>{setForm(null);setDetail(r);setRevision(v=>v+1)}}/>}
 <form className="my-5 flex flex-wrap gap-3" onSubmit={e=>{e.preventDefault();setQuery(search);setPage(1)}}><input className="institutional-field min-w-0" aria-label="Buscar curso o asignación" placeholder="Buscar" value={search} onChange={e=>setSearch(e.target.value)}/><select className="institutional-field" aria-label="Estado académico" value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}}><option value="">Todos los estados</option>{(course?['DRAFT','ACTIVE','INACTIVE','CLOSED']:['ACTIVE','INACTIVE']).map(s=><option key={s} value={s}>{s}</option>)}</select><button className="institutional-button">Buscar</button></form>
 {!virtualMode&&!personal&&can('view')&&<details className="my-5"><summary className="cursor-pointer font-semibold">Filtros académicos</summary><div className="mt-3 grid gap-4 md:grid-cols-2">
 <Lookup endpoint="/api/v1/teaching-options" label="Filtrar docente" name="filter_teacher" kind="teachers" value={filters.teacher_id} onChange={v=>{setFilters({...filters,teacher_id:v});setPage(1)}}/>
 <Lookup endpoint="/api/v1/teaching-options" label="Filtrar asignatura" name="filter_subject" kind="subjects" value={filters.subject_id} onChange={v=>{setFilters({...filters,subject_id:v});setPage(1)}}/>
 <Lookup endpoint="/api/v1/teaching-options" label="Filtrar año" name="filter_year" kind="years" value={filters.academic_year_id} onChange={v=>{setFilters({...filters,academic_year_id:v,grade_level_id:'',section_id:''});setPage(1)}}/>
 {filters.academic_year_id&&<Lookup endpoint="/api/v1/teaching-options" label="Filtrar grado" name="filter_grade" kind="grades" year={filters.academic_year_id} value={filters.grade_level_id} onChange={v=>{setFilters({...filters,grade_level_id:v,section_id:''});setPage(1)}}/>}
 {filters.grade_level_id&&<Lookup endpoint="/api/v1/teaching-options" label="Filtrar sección" name="filter_section" kind="sections" year={filters.academic_year_id} grade={filters.grade_level_id} value={filters.section_id} onChange={v=>{setFilters({...filters,section_id:v});setPage(1)}}/>}
 </div><button className="institutional-button mt-3" onClick={()=>{setFilters({teacher_id:'',subject_id:'',academic_year_id:'',grade_level_id:'',section_id:''});setPage(1)}}>Limpiar filtros</button></details>}
 <Message error>{error}</Message>{loading&&<p role="status">Cargando registros…</p>}
 {(personal||virtualMode)?<CourseCards courses={result?.data ?? []} showRosterCount={user?.roles.includes('TEACHER')} onOpen={id=>void show(id)} href={virtualMode ? id=>'/virtual/courses/'+id+(courseSection?'/'+courseSection:'') : undefined} />:<div className="institutional-card overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{[...(course?['Código / Curso']:[]),'Docente','Asignatura','Año','Grado / Sección','Estado','Acciones'].map(t=><th className="p-3" key={t}>{t}</th>)}</tr></thead><tbody>{result?.data.map(r=><tr className="border-t border-beige" key={r.id}>{course&&<td className="p-3">{r.code}<br/>{r.name}</td>}<td className="p-3">{r.teacher.name}</td><td className="p-3">{r.subject.name}</td><td className="p-3">{r.academic_year.name}</td><td className="p-3">{r.grade_level.name} / {r.section.name}</td><td className="p-3"><Status value={r.status}/></td><td className="p-3"><button className="institutional-button" onClick={()=>void show(r.id)}>Detalle</button></td></tr>)}</tbody></table></div>}
 {!loading&&result?.data.length===0&&<p role="status" className="my-5">No hay cursos o asignaciones disponibles para esta consulta.</p>}<Pager page={result} onPage={setPage}/>
 {detail&&!form&&<section className="institutional-card mt-6 space-y-4" data-testid="teaching-detail"><h2 className="text-xl font-semibold">{detail.name??'Asignación docente'}</h2>{detail.code&&<p>{detail.code}</p>}<Status value={detail.status}/><p>{detail.teacher.name} · {detail.subject.name}</p><p>{detail.academic_year.name} · {detail.grade_level.level} · {detail.grade_level.name} · {detail.section.name}</p><p className="break-words">{detail.description}</p>
 {!personal&&<div className="flex flex-wrap gap-3">{can('update')&&detail.status!=='CLOSED'&&<button className="institutional-button" onClick={()=>setForm({record:detail})}>Editar</button>}
 {course&&can('activate')&&['DRAFT','INACTIVE'].includes(detail.status)&&<button className="institutional-button" disabled={busy} onClick={()=>void action('activate')}>Activar curso</button>}
 {course&&can('update')&&detail.status==='ACTIVE'&&<button className="institutional-button" disabled={busy} onClick={()=>void action('update',{status:'INACTIVE'})}>Inactivar curso</button>}
 {course&&can('close')&&detail.status!=='CLOSED'&&<button className="institutional-button" disabled={busy} onClick={()=>void action('close')}>Cerrar curso</button>}
 {!course&&can('disable')&&detail.status==='ACTIVE'&&<button className="institutional-button" disabled={busy} onClick={()=>void action('disable')}>Deshabilitar asignación</button>}
 {!course&&can('update')&&detail.status==='INACTIVE'&&<button className="institutional-button" disabled={busy} onClick={()=>void action('update',{status:'ACTIVE'})}>Reactivar asignación</button>}</div>}
 {course&&<>{courseTabs(user).length>0&&<CourseLearning key={detail.id} course={detail.id} closed={detail.status==='CLOSED'}/>}{(can('view')||user?.roles.includes('TEACHER'))&&<CourseRoster key={detail.id} id={detail.id}/>}</>}
 </section>}</>
}
