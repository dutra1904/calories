import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { theme } from './theme'
import { ErrorBoundary } from './ErrorBoundary'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ColorModeScript initialColorMode="light" />
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
