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
  DescriptionBook,
  BookForum,
  CreateForum,
  ForumDiscussion,
} from '../pages'

function Stack() {
  return (
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/login-account' element={<LoginAccount />} />
      <Route path='/register' element={<Register />} />
      <Route path='/verify-register' element={<VerifyRegister />} />
      <Route path='/read-book-screen' element={<ReadBookScreen />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/report' element={<Report />} />
      <Route path='/content-moderation' element={<ContentModeration />} />
      <Route path='/description-book' element={<DescriptionBook />} />
      <Route path='/book-forum' element={<BookForum/>} />
      <Route path='/create-forum' element={<CreateForum/>} />
      <Route path='/forum-discussion/:forumId' element={<ForumDiscussion/>} />
    </Routes>
  )
}

export default Stack
