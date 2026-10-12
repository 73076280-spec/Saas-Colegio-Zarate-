import type { InputHTMLAttributes, ReactNode } from 'react'
import Icon from './Icon'
export function Field({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="grid gap-2 text-sm font-medium"><span>{label}</span><input className="institutional-field" {...props} /></label>
}
export function Message({ children, error = false }: { children: ReactNode; error?: boolean }) {
  if (!children) return null
  return <div role={error ? 'alert' : 'status'} className={'my-4 flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ' + (error ? 'border-[#EED4CC] bg-[#FFF4EF] text-[#923F2D]' : 'border-[#D8E4D9] bg-[#F2F7F1] text-[#3E6247]')}><Icon name={error ? 'info' : 'check'} className="mt-0.5" /><p>{children}</p></div>
}
export function PageHeading({ title, description }: { title: string; description: string }) {
  return <div className="mb-8"><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brown-medium">Comunidad educativa</p><h1 className="text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-3 text-brown-medium">{description}</p></div>
}
