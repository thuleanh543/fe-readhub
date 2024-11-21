import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals'
import {BrowserRouter} from 'react-router-dom'
import Stack from './router/Stack'
import {ToastContainer} from 'react-toastify'
import {UserProvider} from './contexts/UserProvider'
import {BooksProvider} from './contexts/BooksProvider'
import useFCM from './hooks/useFCM'

function Root() {
  useFCM(); // Initialize FCM once

  return (
    <BrowserRouter>
      <UserProvider>
        <BooksProvider>
          <ToastContainer />
          <Stack />
        </BooksProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)

reportWebVitals()
