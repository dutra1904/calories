import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LocaleProvider } from './context/LocaleContext'
import { UnitsProvider } from './context/UnitsContext'
import { Header } from './components/Header'
import { ImcPage } from './pages/ImcPage'
import { MetabolismoPage } from './pages/MetabolismoPage'

function App() {
  return (
    <BrowserRouter>
      <LocaleProvider>
        <UnitsProvider>
          <Header />
          <Routes>
            <Route path="/" element={<ImcPage />} />
            <Route path="/metabolismo" element={<MetabolismoPage />} />
          </Routes>
        </UnitsProvider>
      </LocaleProvider>
    </BrowserRouter>
  )
}

export default App
