import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "../src/pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from 'react-toastify';

function App ()
{
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/signup" element={ <SignupPage /> } />
        <Route path="/login" element={ <LoginPage /> } />
        <Route path="*" element={ <LandingPage /> } />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
