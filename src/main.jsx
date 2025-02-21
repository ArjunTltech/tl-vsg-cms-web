import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'


createRoot(document.getElementById('root')).render(


  <StrictMode>
    <ThemeProvider>
      <SocketProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
      </SocketProvider>
    </ThemeProvider>
  </StrictMode>,
)
