import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/dashboard/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import Chart from './components/dashboard/Chart'; 
import TicketForm from './components/forms/TicketForm';
import EngineerForm from './components/forms/EngineerForm';
import LocationForm from './components/forms/LocationForm';
import ContactPage from './components/forms/ContactPage'; 
import SupportPage from './components/support-ticket/SupportPage';
import LoginPage from './LoginPage'; // Import LoginPage

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in by checking localStorage
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (password) => {
    const correctPassword = import.meta.env.VITE_PASSWORD;
    if (password === correctPassword) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true'); 
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn'); 
  };

  return (
    <Router>
      {isLoggedIn ? (
        <>
          <Navbar onLogout={handleLogout} /> 
          <div className="main-container">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<><Dashboard /><Chart /></>} />
              <Route path="/ticket-form" element={<TicketForm />} /> 
              <Route path="/engineer-form" element={<EngineerForm />} /> 
              <Route path="/location-form" element={<LocationForm />} />
              <Route path="/contacts" element={<ContactPage />} /> 
              <Route path="/support-page" element={<SupportPage />} /> 
            </Routes>
          </div>
        </>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </Router>
  );
}

export default App;