import React from 'react';
import './Dashboard.css';
import companyLogo from './company-logo.png'; 

const Dashboard = () => {
  const openTickets = 23; 
  const resolvedTickets = 42; 
  const totalTickets = openTickets + resolvedTickets;

  return (
    <div className="dashboard">
      <div className="dashboard-logo">
        <img src={companyLogo} alt="Company Logo" className="company-logo" />
        <p>Support Ticket Analysis</p>
      </div>
      <div className="dashboard-stats">
        <div className="dashboard-box open-tickets">
          <h3>Open Tickets</h3>
          <h1>{openTickets}</h1>
          <p>Tickets that are currently open and awaiting resolution.</p>
        </div>
        <div className="dashboard-box resolved-tickets">
          <h3>Resolved Tickets</h3>
          <h1>{resolvedTickets}</h1>
          <p>Tickets that have been successfully resolved and closed.</p>
        </div>
        <div className="dashboard-box total-tickets">
          <h3>Total Tickets</h3>
          <h1>{totalTickets}</h1>
          <p>Total count of tickets, including both open and resolved.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
