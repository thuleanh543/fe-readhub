import {Route, Routes} from 'react-router-dom'
import App from '../App'
import {
  LoginAccount,
  Register,
  ReadBookScreen,
  VerifyRegister,
  Dashboard,
  Profile,
  DescriptionBook,
  BookForum,
  CreateForum,
  ForumDiscussion,
  SavedBooks,
  SearchResult,
  ForumReports,
  CreateForumChallenge,
  ChallengeDiscussion,
} from '../pages'
import {PrivateRoute} from '../component/routing/PrivateRoute'
import AdminLayout from '../component/admin/layouts/AdminLayout'
import ProtectedCreateForumRoute from '../component/ProtectedCreateForumRoute'
import ProtectedJoinForumRoute from '../component/ProtectedJoinForumRoute'
import CommentReports from '../pages/comment_report/CommentReports'
import UserManagement from '../pages/user_management/UserManagement'

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
      <Route path='/description-book' element={<DescriptionBook />} />
      <Route
      path='/challenge/:challengeId/discussion'
      element={<ChallengeDiscussion />} />
      <Route
        path='/forum-discussion/:forumId'
        element={
          <ProtectedJoinForumRoute>
            <ForumDiscussion />
          </ProtectedJoinForumRoute>
        }
      />
      <Route path='/book-forum' element={<BookForum />} />
      <Route
          path='/create-forum'
          element={
            <ProtectedCreateForumRoute>
            <CreateForum />
            </ProtectedCreateForumRoute>
          }
      />
      <Route path='/saved-books' element={<SavedBooks />} />
      <Route path='/search-result' element={<SearchResult />} />
      <Route
        path='/admin/*'
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <AdminLayout>
              <Routes>
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='forum-reports' element={<ForumReports />} />
                <Route path='comment-reports' element={<CommentReports />} />
                <Route path='user-management' element={<UserManagement />} />
              </Routes>
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path='/create-forum-challenge'
        element={
          <CreateForumChallenge />
        }
      />
    </Routes>
  )
}

export default Stack
