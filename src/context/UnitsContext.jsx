import { createContext, useContext, useState, useEffect } from 'react'

const UnitsContext = createContext()

export function UnitsProvider({ children }) {
  const [units, setUnits] = useState(() => {
    return localStorage.getItem('imc-units') || 'metric'
  })

  useEffect(() => {
    localStorage.setItem('imc-units', units)
  }, [units])

  const toggleUnits = () => {
    setUnits((prev) => (prev === 'metric' ? 'us' : 'metric'))
  }

  return (
    <UnitsContext.Provider value={{ units, setUnits, toggleUnits }}>
      {children}
    </UnitsContext.Provider>
  )
}

export function useUnits() {
  const context = useContext(UnitsContext)
  if (!context) {
    throw new Error('useUnits must be used within UnitsProvider')
  }
  return context
}
