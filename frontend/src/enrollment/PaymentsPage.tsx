import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, errorMessage } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Field, Message, PageHeading } from '../components/Form'
import { Lookup, Pager, Status } from './shared'
import ConceptsPanel from '../treasury/ConceptsPanel'
import type { Page } from './shared'
type Payment={id:number;student_id:number;academic_year_id:number;payment_concept_id:number;amount:string;due_date:string|null;paid_at:string|null;status:string;observations:string|null;validator:string|null;student:{name:string};concept:{name:string};academic_year:{name:string}}
export type Concept={id:number;name:string;code:string;amount:string;status:string}
function PaymentForm({record,onSaved,onCancel}:{record:Payment|null;onSaved:()=>void;onCancel:()=>void}) {
 const [student,setStudent]=useState(String(record?.student_id??'')),[year,setYear]=useState(String(record?.academic_year_id??'')),[concept,setConcept]=useState(String(record?.payment_concept_id??'')),[amount,setAmount]=useState(record?.amount??''),[date,setDate]=useState(record?.due_date??''),[status,setStatus]=useState(record?.status??'PENDING'),[observations,setObservations]=useState(record?.observations??''),[concepts,setConcepts]=useState<Page<Concept>|null>(null),[page,setPage]=useState(1),[error,setError]=useState(''),[busy,setBusy]=useState(false)
 useEffect(()=>{let alive=true;api<Page<Concept>>('/api/v1/payment-concepts?page='+page).then(r=>{if(alive)setConcepts(r)}).catch(e=>{if(alive)setError(errorMessage(e))});return()=>{alive=false}},[page])
 return <form className="institutional-card my-6 space-y-4" onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');try{await api('/api/v1/student-payments'+(record?'/'+record.id:''),record?'PATCH':'POST',{student_id:Number(student),academic_year_id:Number(year),payment_concept_id:Number(concept),amount,due_date:date||null,status,observations});onSaved()}catch(e){setError(errorMessage(e))}finally{setBusy(false)}}}><h2 className="text-xl font-semibold">{record?'Editar pago':'Registrar pago'}</h2>
 {!record?<div className="grid gap-4 md:grid-cols-2"><Lookup label="Estudiante" name="student_id" kind="students" value={student} onChange={setStudent}/><Lookup label="Año académico" name="academic_year_id" kind="years" value={year} onChange={setYear}/><label className="grid gap-2">Concepto<select name="payment_concept_id" className="institutional-field" required value={concept} onChange={e=>{setConcept(e.target.value);setAmount(concepts?.data.find(c=>String(c.id)===e.target.value)?.amount??'')}}><option value="">Seleccionar</option>{concepts?.data.filter(c=>c.status==='ACTIVE').map(c=><option key={c.id} value={c.id}>{c.name} — {c.code}</option>)}</select></label><Pager page={concepts} onPage={setPage}/></div>:<p>{record.student.name} · {record.concept.name} · {record.academic_year.name}</p>}
 <div className="grid gap-4 sm:grid-cols-2"><Field label="Monto" name="amount" type="number" min="0.01" step="0.01" required value={amount} onChange={e=>setAmount(e.target.value)}/><Field label="Vencimiento" name="due_date" type="date" value={date} onChange={e=>setDate(e.target.value)}/><label className="grid gap-2">Estado<select name="payment_status" className="institutional-field" value={status} onChange={e=>setStatus(e.target.value)}>{['PENDING','OVERDUE','CANCELLED'].map(s=><option key={s} value={s}>{s}</option>)}</select></label></div><label className="grid gap-2">Observaciones<textarea className="institutional-field" maxLength={2000} value={observations} onChange={e=>setObservations(e.target.value)}/></label>
 <Message error>{error}</Message><div className="flex flex-wrap gap-3"><button type="submit" className="institutional-button" disabled={busy}>Guardar pago</button><button type="button" className="institutional-button" onClick={onCancel}>Cerrar formulario</button></div></form>
}
type PaymentsView='payments'|'concepts'|'history'
// Equivale al punto de p[role="status"]::before (index.css), que no aplica a <output>.
const loadingClass="block before:mr-[.6rem] before:inline-block before:size-[.55rem] before:rounded-full before:bg-[#ECA13E] before:content-['']"
function headingFor(view:PaymentsView,center:boolean){
 if(view==='concepts'){return {title:'Conceptos de pago',description:'Catálogo de conceptos e importes registrados en tu institución.'}}
 if(view==='history'){return {title:'Historial de pagos',description:'Consulta de pagos en modo de lectura. No representa un historial de cambios.'}}
 return {title:center?'Pagos':'Tesorería',description:'Registro y validación con los permisos financieros existentes.'}
}
function loadPayments(query:string,onResult:(page:Page<Payment>)=>void,onError:(message:string)=>void){
 let alive=true
 api<Page<Payment>>('/api/v1/student-payments?'+query).then(r=>{if(alive){onResult(r)}}).catch(e=>{if(alive){onError(errorMessage(e))}})
 return()=>{alive=false}
}
async function validatePayment(p:Payment,ui:Readonly<{setBusy:(busy:boolean)=>void;onValidated:()=>void;onError:(message:string)=>void}>){
 if(!window.confirm('Validar el pago de '+p.student.name+'?')){return}
 ui.setBusy(true)
 try{await api('/api/v1/student-payments/'+p.id+'/validate','POST',{});ui.onValidated()}catch(e){ui.onError(errorMessage(e))}finally{ui.setBusy(false)}
}
function PaymentsToolbar({view,center,canCreate,onFilter,onRegister,onToggleConcept}:Readonly<{view:PaymentsView;center:boolean;canCreate:boolean;onFilter:(status:string)=>void;onRegister:()=>void;onToggleConcept:()=>void}>){
 const base=center?'/app/treasury/payments':'/app/payments'
 return <div className="flex flex-wrap gap-3">{view==='payments'&&<><Link className="button-secondary" to={base} onClick={()=>onFilter('')}>Pagos</Link><Link className="button-secondary" to={base+'?status=PENDING'} onClick={()=>onFilter('PENDING')}>Validaciones</Link></>}{view!=='history'&&canCreate&&<>{view==='payments'&&<button type="button" className="institutional-button" onClick={onRegister}>Registrar pago</button>}{(view==='concepts'||!center)&&<button type="button" className="institutional-button" onClick={onToggleConcept}>Nuevo concepto</button>}</>}</div>
}
function ConceptForm({busy,setBusy,onSaved,onError}:Readonly<{busy:boolean;setBusy:(busy:boolean)=>void;onSaved:()=>void;onError:(message:string)=>void}>){
 return <form className="institutional-card my-6 grid gap-4 sm:grid-cols-2" onSubmit={async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));setBusy(true);try{await api('/api/v1/payment-concepts','POST',data);onSaved()}catch(e){onError(errorMessage(e))}finally{setBusy(false)}}}><Field label="Nombre del concepto" name="name" required maxLength={255}/><Field label="Código" name="code" required pattern="[A-Z0-9_-]+" maxLength={60}/><Field label="Importe" name="amount" type="number" min="0.01" step="0.01" required/><button type="submit" className="institutional-button" disabled={busy}>Guardar concepto</button></form>
}
function PaymentFilters({center,search,status,onSearch,onStatus,onSubmit}:Readonly<{center:boolean;search:string;status:string;onSearch:(value:string)=>void;onStatus:(value:string)=>void;onSubmit:()=>void}>){
 return <form className={center?'treasury-filters my-5':'my-5 flex flex-wrap gap-3'} onSubmit={e=>{e.preventDefault();onSubmit()}}><input aria-label="Buscar pago" className="institutional-field min-w-0" placeholder="Estudiante" value={search} onChange={e=>onSearch(e.target.value)}/><select aria-label="Estado de pago" className="institutional-field" value={status} onChange={e=>onStatus(e.target.value)}><option value="">Todos los estados</option>{['PENDING','PAID','OVERDUE','CANCELLED'].map(s=><option value={s} key={s}>{s}</option>)}</select><button type="submit" className="institutional-button">Buscar</button></form>
}
function PaymentRow({payment:p,showActions,canUpdate,canValidate,busy,onEdit,onValidate}:Readonly<{payment:Payment;showActions:boolean;canUpdate:boolean;canValidate:boolean;busy:boolean;onEdit:(payment:Payment)=>void;onValidate:(payment:Payment)=>void}>){
 const open=['PENDING','OVERDUE'].includes(p.status)
 return <tr className="border-t border-beige"><td className="p-3">{p.student.name}</td><td className="p-3">{p.concept.name} / {p.academic_year.name}</td><td className="p-3">{p.amount}</td><td className="p-3">{p.due_date||'—'}</td><td className="p-3"><Status value={p.status}/></td><td className="p-3">{p.paid_at?.slice(0,10)||'—'}</td><td className="p-3">{p.validator||'—'}</td>{showActions&&<td className="p-3"><div className="flex flex-wrap gap-2">{open&&<>{canUpdate&&<button type="button" className="institutional-button" onClick={()=>onEdit(p)}>Editar pago</button>}{canValidate&&<button type="button" className="institutional-button" disabled={busy} onClick={()=>onValidate(p)}>Validar pago</button>}</>}</div></td>}</tr>
}
function PaymentsTable({view,center,result,error,canUpdate,canValidate,busy,onEdit,onValidate,onPage}:Readonly<{view:PaymentsView;center:boolean;result:Page<Payment>|null;error:string;canUpdate:boolean;canValidate:boolean;busy:boolean;onEdit:(payment:Payment)=>void;onValidate:(payment:Payment)=>void;onPage:(page:number)=>void}>){
 return <><div className={center?'institutional-card treasury-table-wrap':'institutional-card overflow-x-auto'}><table className="w-full text-left text-sm"><caption className="sr-only">{view==='history'?'Historial de pagos de la institución':'Pagos de la institución'}</caption><thead><tr>{['Estudiante','Concepto / Año','Monto','Vencimiento','Estado','Fecha de pago','Validado por',...(view==='history'?[]:['Acciones'])].map(t=><th scope="col" className="p-3" key={t}>{t}</th>)}</tr></thead><tbody>{result?.data.map(p=><PaymentRow key={p.id} payment={p} showActions={view==='payments'} canUpdate={canUpdate} canValidate={canValidate} busy={busy} onEdit={onEdit} onValidate={onValidate}/>)}</tbody></table>{result?.data.length===0&&<p>No hay pagos para esta consulta.</p>}{!result&&!error&&<output className={loadingClass}>Cargando pagos…</output>}</div><Pager page={result} onPage={onPage}/></>
}
export default function PaymentsPage({view='payments',center=false}:Readonly<{view?:PaymentsView;center?:boolean}>){
 const {user}=useAuth(),can=(p:string)=>!!user?.permissions.includes('payments.'+p)
 const [params]=useSearchParams(),[page,setPage]=useState(1),[query,setQuery]=useState(''),[search,setSearch]=useState(''),[status,setStatus]=useState(params.get('status')??(view==='history'?'PAID':'')),[result,setResult]=useState<Page<Payment>|null>(null),[error,setError]=useState(''),[revision,setRevision]=useState(0),[form,setForm]=useState<{record:Payment|null}|null>(null),[conceptForm,setConceptForm]=useState(view==='concepts'&&params.get('create')==='1'&&!!user?.permissions.includes('payments.create')),[busy,setBusy]=useState(false)
 useEffect(()=>{if(view==='concepts'||!user?.permissions.includes('payments.view')){return}return loadPayments(new URLSearchParams({page:String(page),search:query,status}).toString(),r=>{setResult(r);setError('')},setError)},[page,query,status,revision,user,view]) // permissions change with the session
 if(!can('view')){return <Message error>No tienes permiso para consultar pagos.</Message>}
 const heading=headingFor(view,center)
 const validate=(p:Payment)=>validatePayment(p,{setBusy,onValidated:()=>{setRevision(v=>v+1);setError('')},onError:setError})
 return <><PageHeading title={heading.title} description={heading.description}/><PaymentsToolbar view={view} center={center} canCreate={can('create')} onFilter={s=>{setStatus(s);setPage(1)}} onRegister={()=>setForm({record:null})} onToggleConcept={()=>setConceptForm(v=>!v)}/>
 {view!=='history'&&conceptForm&&<ConceptForm busy={busy} setBusy={setBusy} onError={setError} onSaved={()=>{setConceptForm(false);setError('');setRevision(v=>v+1)}}/>}
 {view==='payments'&&form&&<PaymentForm record={form.record} onCancel={()=>setForm(null)} onSaved={()=>{setForm(null);setRevision(v=>v+1)}}/>}
 {view==='concepts'?<><Message error>{error}</Message><ConceptsPanel revision={revision}/></>:<><PaymentFilters center={center} search={search} status={status} onSearch={setSearch} onStatus={s=>{setStatus(s);setPage(1)}} onSubmit={()=>{setQuery(search);setPage(1)}}/><Message error>{error}</Message><PaymentsTable view={view} center={center} result={result} error={error} canUpdate={can('update')} canValidate={can('validate')} busy={busy} onEdit={p=>setForm({record:p})} onValidate={validate} onPage={setPage}/></>}</>
}
