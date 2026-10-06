import { useCallback, useEffect, useRef, useState } from 'react'
import { api, errorMessage } from './client'
export function useResource<T>(path: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const latest = useRef(0)
  const reload = useCallback(async () => {
    const request = ++latest.current
    setLoading(true); setError('')
    try {
      const result = await api<T>(path)
      if (request === latest.current) setData(result)
    } catch (failure) {
      if (request === latest.current) setError(errorMessage(failure))
    } finally {
      if (request === latest.current) setLoading(false)
    }
  }, [path])
  const invalidate = useCallback(() => { latest.current++ }, [])
  useEffect(() => {
    void reload()
    return invalidate
  }, [reload, invalidate])
  return { data, error, loading, reload }
}
