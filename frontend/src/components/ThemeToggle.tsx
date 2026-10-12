import Icon from './Icon'
export type Theme = 'light' | 'dark'
export function savedTheme(key: string): Theme {
  try { return localStorage.getItem(key) === 'dark' ? 'dark' : 'light' } catch { return 'light' }
}
export default function ThemeToggle({ theme, change }: { theme: Theme; change: (theme: Theme) => void }) {
  return <button type="button" className="theme-toggle button-secondary" aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'} title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'} aria-pressed={theme === 'dark'} onClick={() => change(theme === 'dark' ? 'light' : 'dark')}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /><span className="sr-only">Cambiar tema</span></button>
}
