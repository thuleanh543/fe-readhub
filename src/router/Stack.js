import { Route, Routes } from 'react-router-dom'
import App from '../App'
import { PushImage, LoginAccount } from '../pages'
import Register from '../pages/register/Register'

function Stack () {
  return (
    <Routes>
      <Route path="/" element={ <App /> } />
      <Route path="/PushImage" element={ <PushImage /> } />
      <Route path="/LoginAccount" element={ <LoginAccount /> } />
      <Route path="/Register" element={ <Register /> } />
    </Routes>
  )
}

export default Stack
