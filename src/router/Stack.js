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
  SavedBooks,
} from '../pages'
import { PrivateRoute } from '../component/routing/PrivateRoute';
import AdminLayout from '../component/layouts/AdminLayout';

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
      <Route path='/forum-discussion/:forumId' element={<ForumDiscussion/>} />
      <Route path='/book-forum' element={<BookForum />} />
      <Route path='/create-forum' element={<CreateForum />} />
      <Route path='/saved-books' element={<SavedBooks />} />
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                {/* <Route path="forum-reports" element={<ForumReports />} />
                <Route path="user-management" element={<UserManagement />} /> */}
                <Route path="content-moderation" element={<ContentModeration />} />
              </Routes>
            </AdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default Stack
