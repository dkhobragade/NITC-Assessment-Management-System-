import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LandingPage from './pageLevel/LandingPage'
import SignupPage from './pageLevel/SignupPage'
import LoginPage from './pageLevel/LoginPage'
import AdminOverview from './pageLevel/overview/AdminOverview'
import FacultyOverview from './pageLevel/overview/FacultyOverview'
import EvaluatorOverview from './pageLevel/overview/EvaluatorOverview'
import StudentOverview from './pageLevel/overview/StudentOverview'
import CommonLayout from './layout/CommonLayout'
import ManageFaculty from './pageLevel/admin/ManageFaculty'
import ManageCourse from './pageLevel/admin/ManageCourse'
import AdminGenerateReport from './pageLevel/admin/GenerateReport'
import FacultyGenerateReport from './pageLevel/faculty/GenerateReport'
import EvalutorGenerateReport from './pageLevel/evalutor/GenerateReport'
import CreateTask from './pageLevel/faculty/CreateTask'
import ManageEvalutor from './pageLevel/faculty/ManageEvalutor'
import ManageStudent from './pageLevel/faculty/ManageStudent'
import MapEvalutor from './pageLevel/faculty/MapEvalutor'
import AssignedStudent from './pageLevel/evalutor/AssignedStudent'
import Task from './pageLevel/student/Task'
import Result from './pageLevel/student/Result'
import AssignCourse from './pageLevel/admin/AssignCourse'
import { ToastContainer } from 'react-toastify'
import './App.css'
import { useAtom } from 'jotai'
import { userAtom } from './lib/store/userAtom'
import { useEffect } from 'react'
import { ForgotPassword } from './pageLevel/ForgotPassword'

function App ()
{

  const [ user ] = useAtom( userAtom );
  const navigate = useNavigate();

  useEffect( () =>
  {
    if ( user?.role )
    {
      navigate( `/${ user.role.toLowerCase() }-overview` );
    }
  }, [ user ] );

  return <>

    <Routes>
      <Route path="/" element={ <LandingPage /> } />
      <Route path="/signup" element={ <SignupPage /> } />
      <Route path="/login" element={ <LoginPage /> } />
      <Route path="/forgot-password" element={ <ForgotPassword /> } />


      <Route element={ <CommonLayout /> }>
        <Route path="/admin-overview" element={ <AdminOverview /> } />
        <Route path="/faculty-overview" element={ <FacultyOverview /> } />
        <Route path="/evaluator-overview" element={ <EvaluatorOverview /> } />
        <Route path="/student-overview" element={ <StudentOverview /> } />
        <Route path="/admin-manage-faculty" element={ <ManageFaculty /> } />
        <Route path="/admin-add-course" element={ <ManageCourse /> } />
        <Route path="/admin-assign-course" element={ <AssignCourse /> } />
        <Route path="/admin-generate-report" element={ <AdminGenerateReport /> } />
        <Route path="/faculty-generate-report" element={ <FacultyGenerateReport /> } />
        <Route path="/evaluator-generate-report" element={ <EvalutorGenerateReport /> } />
        <Route path="/evaluator-assigned-student" element={ <AssignedStudent /> } />
        <Route path="/faculty-manage-evalutor" element={ <ManageEvalutor /> } />
        <Route path="/faculty-manage-student" element={ <ManageStudent /> } />
        <Route path="/faculty-create-task" element={ <CreateTask /> } />
        <Route path="/faculty-map-evalutor" element={ <MapEvalutor /> } />
        <Route path="/student-task" element={ <Task /> } />
        <Route path="/student-result" element={ <Result /> } />
      </Route>
      <Route path="*" element={ <Navigate to="/" replace /> } />
    </Routes>
    <ToastContainer autoClose={ 5000 } position="bottom-right" />
  </>
}

export default App
