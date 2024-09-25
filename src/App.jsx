import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/dashboard/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import Chart from './components/dashboard/Chart'; 
import TicketForm from './components/forms/TicketForm';
import EngineerForm from './components/forms/EngineerForm';
import LocationForm from './components/forms/LocationForm';
import ContactPage from './components/forms/ContactPage'; 
import SupportPage from './components/support-ticket/SupportPage';
import CallReports from './components/forms/CallReports'; 
import LoginPage from './LoginPage'; 
import Help from './components/help/Help';

const PrivateRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <PrivateRoute>
            <Navbar onLogout={handleLogout} />
            <div className="main-container">
              <Dashboard />
              <Chart />
            </div>
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Navbar onLogout={handleLogout} />
            <div className="main-container">
              <Dashboard />
              <Chart />
            </div>
          </PrivateRoute>
        } />
        <Route path="/ticket-form" element={
          <PrivateRoute>
            <Navbar onLogout={handleLogout} />
            <TicketForm />
          </PrivateRoute>
        } />
        <Route path="/engineer-form" element={
          <PrivateRoute>
            <Navbar onLogout={handleLogout} />
            <EngineerForm />
          </PrivateRoute>
        } />
        <Route path="/location-form" element={
          <PrivateRoute>
            <Navbar onLogout={handleLogout} />
            <LocationForm />
          </PrivateRoute>
        } />
        <Route path="/contacts" element={
          <PrivateRoute>
            <Navbar onLogout={handleLogout} />
            <ContactPage />
          </PrivateRoute>
        } />
        <Route path="/support-page" element={
          <PrivateRoute>
            <Navbar onLogout={handleLogout} />
            <SupportPage />
          </PrivateRoute>
        } />
        <Route path="/call-reports" element={
          <PrivateRoute>
            <Navbar onLogout={handleLogout} />
            <CallReports />
          </PrivateRoute>
        } />
        <Route path="/help" element={
          <PrivateRoute>
            <Navbar onLogout={handleLogout} />
            <Help />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
