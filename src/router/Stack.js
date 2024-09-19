import { Route, Routes } from 'react-router-dom'
import App from '../App'
import { LoginAccount, Register, VerifyRegister, ReadBookScreen } from '../pages'

function Stack () {
  return (
    <Routes>
      <Route path="/" element={ <App /> } />
      <Route path="/LoginAccount" element={ <LoginAccount /> } />
      <Route path="/Register" element={ <Register /> } />
      <Route path="/VerifyRegister" element={ <VerifyRegister /> } />
      <Route path="/ReadBookScreen" element={ <ReadBookScreen /> } />
    </Routes>
  )
}

export default Stack
