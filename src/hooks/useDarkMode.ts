import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useDarkMode() {
  const [isDark, setIsDark] = useLocalStorage('darkMode', 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return { isDark, toggleDarkMode: () => setIsDark(!isDark) }
}