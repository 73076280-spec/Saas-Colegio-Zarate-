import ReportsPage from './reports/ReportsPage'
import RequestsPage from './office/RequestsPage'
import DocumentsPage from './office/DocumentsPage'
import CommunicationsPage from './office/CommunicationsPage'
import NotificationsPage from './office/NotificationsPage'
import PersonalAttendance from './attendance/PersonalAttendance'
import JustificationsPage from './attendance/JustificationsPage'
import LearningPanel from './learning/LearningPanel'
import TeachingPage from './courses/TeachingPage'
import EnrollmentsPage from './enrollment/EnrollmentsPage'
import PaymentsPage from './enrollment/PaymentsPage'
import PeopleHome from './people/PeopleHome'
import PeoplePage from './people/PeoplePage'
import AcademicHome from './academic/AcademicHome'
import AcademicPage from './academic/AcademicPage'
import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import TechnicalPage from './pages/TechnicalPage'
import LoginPage from './pages/LoginPage'
import AppLayout from './layouts/AppLayout'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import PasswordPage from './pages/PasswordPage'
import UsersPage from './pages/UsersPage'
import InstitutionPage from './pages/InstitutionPage'
import RolesPage from './pages/RolesPage'
import AuditPage from './pages/AuditPage'
import { Message } from './components/Form'
function Protected({ children, password = false, permission }: { children: ReactNode; password?: boolean; permission?: string }) {
  const { user, loading, error, refresh } = useAuth()
  if (loading) return <p role="status" className="p-8">Consultando sesión…</p>
  if (error) return <main className="mx-auto max-w-xl p-8"><Message error>{error}</Message><button className="institutional-button" onClick={() => void refresh()}>Volver a intentar</button></main>
  if (!user) return <Navigate to="/login" replace />
  if (user.must_change_password && !password) return <Navigate to="/app/change-password" replace />
  if (permission && !user.permissions.includes(permission)) return <Message error>No tienes permiso para acceder a esta sección.</Message>
  return children
}
export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<TechnicalPage />} />
    <Route path="*" element={<AuthProvider><Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<Protected password><AppLayout /></Protected>}>
        <Route path="reports" element={<Protected><ReportsPage /></Protected>} />
        <Route path="requests" element={<Protected permission="requests.view"><RequestsPage /></Protected>} />
        <Route path="my-requests" element={<Protected permission="requests.view"><RequestsPage personal /></Protected>} />
        <Route path="documents" element={<Protected permission="documents.view"><DocumentsPage /></Protected>} />
        <Route path="communications" element={<Protected permission="communications.view"><CommunicationsPage /></Protected>} />
        <Route path="notifications" element={<Protected permission="notifications.view"><NotificationsPage /></Protected>} />
        <Route path="my-attendance" element={<Protected permission="attendance.view"><PersonalAttendance /></Protected>} />
        <Route path="family-attendance" element={<Protected permission="attendance.view"><PersonalAttendance family /></Protected>} />
        <Route path="justifications" element={<Protected permission="justifications.view"><JustificationsPage /></Protected>} />
        <Route path="courses" element={<Protected><TeachingPage /></Protected>} />
        <Route path="my-assignments" element={<Protected permission="assignments.view"><LearningPanel kind="assignments" /></Protected>} />
        <Route path="my-submissions" element={<Protected permission="submissions.view"><LearningPanel kind="submissions" /></Protected>} />
        <Route path="my-assessments" element={<Protected permission="assessments.view"><LearningPanel kind="assessments" /></Protected>} />
        <Route path="my-scores" element={<Protected permission="scores.view"><LearningPanel kind="scores" /></Protected>} />
        <Route path="teacher-assignments" element={<Protected permission="teacher-assignments.view"><TeachingPage kind="teacher-assignments" /></Protected>} />
        <Route path="my-courses" element={<Protected><TeachingPage personal /></Protected>} />
        <Route path="my-courses/:id" element={<Protected><TeachingPage personal /></Protected>} />
        <Route path="enrollments" element={<Protected><EnrollmentsPage /></Protected>} />
        <Route path="payments" element={<Protected permission="payments.view"><PaymentsPage /></Protected>} />
        <Route path="academic" element={<Protected><AcademicHome /></Protected>} />
        <Route path="academic/:catalog" element={<Protected><AcademicPage /></Protected>} />
        <Route path="people" element={<Protected><PeopleHome /></Protected>} />
        <Route path="people/:type" element={<Protected><PeoplePage /></Protected>} />
        <Route index element={<Protected><DashboardPage /></Protected>} />
        <Route path="change-password" element={<PasswordPage />} />
        <Route path="profile" element={<Protected permission="profile.view"><ProfilePage /></Protected>} />
        <Route path="users" element={<Protected permission="users.view"><UsersPage /></Protected>} />
        <Route path="institution" element={<Protected permission="institutions.view"><InstitutionPage /></Protected>} />
        <Route path="roles" element={<Protected permission="roles.view"><RolesPage /></Protected>} />
        <Route path="audit" element={<Protected permission="audit.view"><AuditPage /></Protected>} />
      </Route>
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes></AuthProvider>} />
  </Routes></BrowserRouter>
}
