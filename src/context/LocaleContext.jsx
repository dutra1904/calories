import { createContext, useContext, useState, useEffect } from 'react'

const LocaleContext = createContext()

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('imc-locale') || 'pt'
  })

  useEffect(() => {
    localStorage.setItem('imc-locale', locale)
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en'
  }, [locale])

  const toggleLocale = () => {
    setLocale((prev) => (prev === 'pt' ? 'en' : 'pt'))
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return context
}
