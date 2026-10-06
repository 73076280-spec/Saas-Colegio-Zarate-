import type { InputHTMLAttributes, ReactNode } from 'react'
export function Field({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="grid gap-2 text-sm font-medium"><span>{label}</span><input className="institutional-field" {...props} /></label>
}
export function Message({ children, error = false }: { children: ReactNode; error?: boolean }) {
  if (!children) return null
  return <p role={error ? 'alert' : 'status'} className="my-4 rounded-xl border border-brown-light bg-beige p-4 text-sm leading-6 text-text-dark">{children}</p>
}
export function PageHeading({ title, description }: { title: string; description: string }) {
  return <div className="mb-8"><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brown-medium">Comunidad educativa</p><h1 className="text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-3 text-brown-medium">{description}</p></div>
}
