import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals'
import {BrowserRouter} from 'react-router-dom'
import Stack from './router/Stack'
import {ToastContainer} from 'react-toastify'
import {UserProvider} from './contexts/UserProvider'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <UserProvider>
        <Stack />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

reportWebVitals()
