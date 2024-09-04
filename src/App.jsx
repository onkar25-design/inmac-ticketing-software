import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/dashboard/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import Chart from './components/dashboard/Chart'; 
import TicketForm from './components/forms/TicketForm';
import EngineerForm from './components/forms/EngineerForm';
import LocationForm from './components/forms/LocationForm';
import ContactPage from './components/forms/ContactPage'; 
import SupportPage from '../src/components/support-ticket/SupportPage'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-container">
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <Dashboard />
                <Chart />
              </>
            } 
          />
          <Route path="/ticket-form" element={<TicketForm />} /> 
          <Route path="/engineer-form" element={<EngineerForm />} /> 
          <Route path="/location-form" element={<LocationForm />} />
          <Route path="/contacts" element={<ContactPage />} /> 
          <Route path="/support-page" element={<SupportPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
