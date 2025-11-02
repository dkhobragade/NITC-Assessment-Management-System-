import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "../src/pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import { ToastContainer } from 'react-toastify';
import FacultyDashboard from "./pages/FacultyDashboard";
import EvaluatorDashboard from "./pages/EvaluatorDashboard";
import StudentDashboard from "./pages/StudentDashboard";

function App ()
{
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/signup" element={ <SignupPage /> } />
        <Route path="/login" element={ <LoginPage /> } />
        <Route path="/admindashboard" element={ <AdminDashboard /> } />
        <Route path="/facultydashboard" element={ <FacultyDashboard /> } />
        <Route path="/evaluatordashboard" element={ <EvaluatorDashboard /> } />
        <Route path="/studentdashboard" element={ <StudentDashboard /> } />
        <Route path="*" element={ <LandingPage /> } />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
