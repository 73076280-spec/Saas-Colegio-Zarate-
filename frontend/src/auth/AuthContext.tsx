import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { api, ApiError, errorMessage } from '../api/client'
import type { User } from './types'

type AuthValue = { user: User | null; loading: boolean; error: string; refresh: () => Promise<void>; login: (data: Record<string, string>) => Promise<User>; logout: () => Promise<void>; setUser: (user: User) => void }
const AuthContext = createContext<AuthValue | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try { setUser((await api<{ data: User }>('/api/v1/auth/me')).data) }
    catch (failure) {
      setUser(null)
      if (!(failure instanceof ApiError && [401, 419].includes(failure.status))) setError(errorMessage(failure))
    } finally { setLoading(false) }
  }, [])
  useEffect(() => {
    void refresh()
    const expire = () => setUser(null)
    window.addEventListener('session-expired', expire)
    return () => window.removeEventListener('session-expired', expire)
  }, [refresh])
  const login = async (data: Record<string, string>) => {
    await api('/sanctum/csrf-cookie')
    const response = await api<{ data: User }>('/api/v1/auth/login', 'POST', data)
    setUser(response.data)
    setError('')
    return response.data
  }
  const logout = async () => {
    await api('/api/v1/auth/logout', 'POST')
    setUser(null)
  }
  return <AuthContext.Provider value={{ user, loading, error, refresh, login, logout, setUser }}>{children}</AuthContext.Provider>
}
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthProvider is required')
  return value
}
