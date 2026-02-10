import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { extendTheme } from '@chakra-ui/react'  // if you want custom theme
import './index.css'
import App from './App.tsx'

// Optional: your custom theme (uncomment/move your extendTheme here if needed)
const theme = extendTheme({
  colors: {
    brand: {
      500: "#7fb432",
      dark: "#2d3436",
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>
)