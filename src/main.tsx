import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { extendTheme } from '@chakra-ui/react'
import { CartProvider } from './Components/CartContext'
import './index.css'
import App from './App.tsx'

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
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>
)