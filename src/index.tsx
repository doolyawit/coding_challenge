import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import theme from './theme'
import { ThemeProvider } from '@emotion/react'
import { CartContextProvider } from './Components/Contexts/CarProvider'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CartContextProvider>
        <App />
      </CartContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
