import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './Components/App'
import { AuthProvider } from "react-auth-kit"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
    <React.StrictMode>
      <AuthProvider
        authType={'cookie'}
        authName={'token'}
        cookieSecure={true}>
          <App />
      </AuthProvider>
    </React.StrictMode>
)
