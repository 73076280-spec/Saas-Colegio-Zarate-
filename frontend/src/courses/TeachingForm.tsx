import { useState } from 'react'
import { api, errorMessage } from '../api/client'
import { Field, Message } from '../components/Form'
import { Lookup } from '../enrollment/shared'
export type TeachingRecord={id:number;teacher_id:number;subject_id:number;academic_year_id:number;grade_level_id:number;section_id:number;teacher_assignment_id?:number;name?:string;code?:string;description?:string|null;status:string;students_count?:number;teacher:{name:string};subject:{name:string};academic_year:{name:string};grade_level:{name:string;level:string};section:{name:string}}
export default function TeachingForm({kind,record,onSaved,onCancel}:{kind:'courses'|'teacher-assignments';record:TeachingRecord|null;onSaved:(r:TeachingRecord)=>void;onCancel:()=>void}) {
 const course=kind==='courses'
 const [teacher,setTeacher]=useState(String(record?.teacher_id??'')),[subject,setSubject]=useState(String(record?.subject_id??'')),[year,setYear]=useState(String(record?.academic_year_id??'')),[grade,setGrade]=useState(String(record?.grade_level_id??'')),[section,setSection]=useState(String(record?.section_id??'')),[name,setName]=useState(record?.name??''),[code,setCode]=useState(record?.code??''),[description,setDescription]=useState(record?.description??''),[busy,setBusy]=useState(false),[error,setError]=useState('')
 const endpoint='/api/v1/teaching-options'
 return <form className="institutional-card my-6 space-y-4" onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');try{
 const r=await api<{data:TeachingRecord}>('/api/v1/'+kind+(record?'/'+record.id:''),record?'PATCH':'POST',{teacher_id:Number(teacher),subject_id:Number(subject),academic_year_id:Number(year),grade_level_id:Number(grade),section_id:Number(section),...(course?{name,code,description}:{})})
 onSaved(r.data)
 }catch(e){setError(errorMessage(e))}finally{setBusy(false)}}}>
 <h2 className="text-xl font-semibold">{record?'Editar': 'Crear'} {course?'curso':'asignación docente'}</h2>
 {course&&record?<p>{record.teacher.name} · {record.subject.name} · {record.academic_year.name} · {record.grade_level.name} · {record.section.name}</p>:<div className="grid gap-4 md:grid-cols-2">
 <Lookup endpoint={endpoint} label="Docente" name="teacher_id" kind="teachers" value={teacher} onChange={setTeacher}/>
 <Lookup endpoint={endpoint} label="Asignatura" name="subject_id" kind="subjects" value={subject} onChange={setSubject}/>
 <Lookup endpoint={endpoint} label="Año académico" name="academic_year_id" kind="years" value={year} onChange={v=>{setYear(v);setGrade('');setSection('')}}/>
 {year&&<Lookup endpoint={endpoint} label="Grado" name="grade_level_id" kind="grades" year={year} value={grade} onChange={v=>{setGrade(v);setSection('')}}/>}
 {grade&&<Lookup endpoint={endpoint} label="Sección" name="section_id" kind="sections" year={year} grade={grade} value={section} onChange={setSection}/>}
 </div>}
 {course&&<><p className="text-sm text-brown-medium">Debe existir una asignación docente activa para esta combinación. El curso se crea en borrador.</p><div className="grid gap-4 sm:grid-cols-2"><Field label="Nombre del curso" name="name" required maxLength={150} value={name} onChange={e=>setName(e.target.value)}/><Field label="Código del curso" name="code" required pattern="[A-Za-z0-9_-]+" maxLength={60} value={code} onChange={e=>setCode(e.target.value)}/></div><label className="grid gap-2">Descripción<textarea className="institutional-field" name="description" maxLength={2000} value={description} onChange={e=>setDescription(e.target.value)}/></label></>}
 <Message error>{error}</Message><div className="flex flex-wrap gap-3"><button className="institutional-button" disabled={busy||!section}>Guardar {course?'curso':'asignación'}</button><button className="institutional-button" type="button" onClick={onCancel}>Cerrar formulario</button></div>
 </form>
}
