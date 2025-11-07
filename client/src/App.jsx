import { Routes, Route } from 'react-router-dom'
import LandingPage from './pageLevel/LandingPage'
import SignupPage from './pageLevel/SignupPage'
import LoginPage from './pageLevel/LoginPage'
import AdminOverview from './pageLevel/overview/AdminOverview'
import FacultyOverview from './pageLevel/overview/FacultyOverview'
import EvaluatorOverview from './pageLevel/overview/EvaluatorOverview'
import StudentOverview from './pageLevel/overview/StudentOverview'
import CommonLayout from './layout/CommonLayout'
import './App.css'

function App ()
{

  return (
    <Routes>
      <Route path="/" element={ <LandingPage /> } />
      <Route path="/signup" element={ <SignupPage /> } />
      <Route path="/login" element={ <LoginPage /> } />

      {/* Protected / Dashboard Routes (with Navbar) */ }
      <Route element={ <CommonLayout /> }>
        <Route path="/admin-overview" element={ <AdminOverview /> } />
        <Route path="/faculty-overview" element={ <FacultyOverview /> } />
        <Route path="/evaluator-overview" element={ <EvaluatorOverview /> } />
        <Route path="/student-overview" element={ <StudentOverview /> } />
      </Route>
    </Routes>
  )
}

export default App
