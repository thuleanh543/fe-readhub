import {Route, Routes} from 'react-router-dom'
import App from '../App'
import {
  LoginAccount,
  Register,
  ReadBookScreen,
  VerifyRegister,
  Dashboard,
  Report,
  ContentModeration,
  Profile,
} from '../pages'

function Stack() {
  return (
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/LoginAccount' element={<LoginAccount />} />
      <Route path='/Register' element={<Register />} />
      <Route path='/VerifyRegister' element={<VerifyRegister />} />
      <Route path='/ReadBookScreen' element={<ReadBookScreen />} />
      <Route path='/Profile' element={<Profile />} />
      <Route path='/Dashboard' element={<Dashboard />} />
      <Route path='/Report' element={<Report />} />
      <Route path='/ContentModeration' element={<ContentModeration />} />
    </Routes>
  )
}

export default Stack
