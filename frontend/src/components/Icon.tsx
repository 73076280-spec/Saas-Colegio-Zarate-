const paths: Record<string, string> = {
  moon: 'M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z',
  sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1',
  home: 'm3 10 9-7 9 7v10H3ZM9 20v-7h6v7',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
  book: 'M12 6v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z',
  chart: 'M4 3v17h17M8 16v-5m5 5V7m5 9V4',
  calendar: 'M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M7 15h2m4 0h2',
  file: 'M5 3h9l5 5v13H5ZM14 3v6h5M8 13h8m-8 4h5',
  shield: 'M12 3 3 6v6c0 5 9 9 9 9s9-4 9-9V6ZM8 12l3 3 5-6',
  wallet: 'M3 6h17v15H3ZM3 6V4h14v2M15 11h6v5h-6Z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  check: 'm5 12 4 4L19 6',
  info: 'M12 16v-5m0-4v1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  camera: 'M3 7h4l2-3h6l2 3h4v14H3ZM16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
}
export default function Icon({ name = 'book', className = '' }: { name?: string; className?: string }) {
  return <svg aria-hidden="true" className={'size-5 shrink-0 ' + className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name] || paths.book} /></svg>
}
export function navigationIcon(path: string) {
  if (path === '/app') return 'home'
  if (/profile|people|users|teacher-assignments/.test(path)) return 'user'
  if (/report|scores/.test(path)) return 'chart'
  if (/payment/.test(path)) return 'wallet'
  if (/attendance|academic|enrollment/.test(path)) return 'calendar'
  if (/roles|audit|password/.test(path)) return 'shield'
  if (/notifications|communications/.test(path)) return 'bell'
  if (/requests|documents|justifications/.test(path)) return 'file'
  return 'book'
}
