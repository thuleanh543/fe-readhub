import { Route, Routes } from 'react-router-dom'
import App from '../App'
import { LoginAccount, Register, VerifyRegister, } from '../pages'

function Stack () {
  return (
    <Routes>
      <Route path="/" element={ <App /> } />
      <Route path="/LoginAccount" element={ <LoginAccount /> } />
      <Route path="/Register" element={ <Register /> } />
      <Route path="/VerifyRegister" element={ <VerifyRegister /> } />
    </Routes>
  )
}

export default Stack
