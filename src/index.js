import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import Stack from './router/Stack'
import { ToastContainer } from 'react-toastify'

const root = ReactDOM.createRoot( document.getElementById( 'root' ) )
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <Stack />
    </BrowserRouter>
  </React.StrictMode>
)

reportWebVitals()
