import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
export type Page<T> = { data:T[]; meta?:{current_page:number;last_page:number}; current_page?:number;last_page?:number }
export type Option = { id:number;name:string;capacity?:number|null;occupied?:number }
export const enrollmentStates=['DRAFT','PENDING','OBSERVED','APPROVED','REJECTED','CANCELLED']
export const labels:Record<string,string>={DRAFT:'Borrador',PENDING:'Pendiente',OBSERVED:'Observada',APPROVED:'Aprobada',REJECTED:'Rechazada',ACTIVE:'Activo',INACTIVE:'Inactivo',CLOSED:'Cerrado',CANCELLED:'Cancelada',PAID:'Pagado',OVERDUE:'Vencido'}
export function Status({value}:{value:string}) { return <span className="rounded-full border border-brown-light bg-beige px-3 py-1 text-xs font-semibold">{labels[value]||value}</span> }
export function Pager({page,onPage}:{page:Page<unknown>|null;onPage:(n:number)=>void}) {
 const current=page?.meta?.current_page??page?.current_page??1,last=page?.meta?.last_page??page?.last_page??1
 return <div className="my-4 flex flex-wrap items-center gap-4"><button type="button" className="institutional-button" disabled={current<=1} onClick={()=>onPage(current-1)}>Anterior</button><span>Página {current} de {last}</span><button type="button" className="institutional-button" disabled={current>=last} onClick={()=>onPage(current+1)}>Siguiente</button></div>
}
export function Lookup({label,name,kind,value,onChange,year='',grade='',revision=0,endpoint='/api/v1/enrollment-options'}:{label:string;name:string;kind:string;value:string;onChange:(v:string)=>void;year?:string;grade?:string;revision?:number;endpoint?:string}) {
 const [search,setSearch]=useState(''),[page,setPage]=useState(1),[result,setResult]=useState<Page<Option>|null>(null),[error,setError]=useState('')
 useEffect(()=>{ let alive=true
 const timer=setTimeout(()=>{
 const params=new URLSearchParams({kind,search,page:String(page),academic_year_id:year||'0',grade_level_id:grade||'0'})
 if(!year) params.delete('academic_year_id')
 if(!grade) params.delete('grade_level_id')
 api<Page<Option>>(endpoint+'?'+params).then(v=>{if(alive){setResult(v);setError('')}}).catch(e=>{if(alive)setError(errorMessage(e))})
 },200)
 return ()=>{alive=false;clearTimeout(timer)}
 },[kind,search,page,year,grade,revision,endpoint])
 return <fieldset className="min-w-0 rounded-xl border border-beige p-3"><legend className="text-sm font-semibold">{label}</legend><input className="institutional-field mb-2 w-full" aria-label={'Buscar '+label} value={search} placeholder="Buscar" onChange={e=>{setSearch(e.target.value);setPage(1)}}/><select className="institutional-field w-full" name={name} required value={value} onChange={e=>onChange(e.target.value)}><option value="">Seleccionar</option>{value&&!result?.data.some(o=>String(o.id)===value)&&<option value={value}>Selección actual #{value}</option>}{result?.data.map(o=><option key={o.id} value={o.id}>{o.name}{kind==='sections'&&o.occupied!==undefined?' — '+o.occupied+'/'+(o.capacity??'sin límite')+' estudiantes':''}</option>)}</select><Message error>{error}</Message><Pager page={result} onPage={setPage}/></fieldset>
}
