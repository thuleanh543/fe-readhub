import { Route, Routes } from 'react-router-dom'
import App from '../App'
import { PushImage, LoginAccount } from '../pages'

function Stack() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/PushImage" element={<PushImage />} />
      <Route path="/LoginAccount" element={<LoginAccount />} />
    </Routes>
  )
}

export default Stack
