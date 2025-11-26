
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import theme from './components/Theme.jsx'
import ScrollToTop from './components/ScrollTop.jsx'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  
  <ThemeProvider theme={theme}>
    <CssBaseline/>
    <BrowserRouter>
      <ScrollToTop/>
      <App />

    </BrowserRouter>
  </ThemeProvider>

)
