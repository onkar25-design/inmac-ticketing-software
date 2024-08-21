import React from 'react';
import './Navbar.css';
import { FaTicketAlt } from 'react-icons/fa'; 
import { Link } from 'react-router-dom'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <FaTicketAlt className="ticket-icon" /> 
        <Link to="/" className="navbar-heading">
          <h2>Ticketing Dashboard</h2>
        </Link>
      </div>
      <div className="navbar-links">
        <div className="dropdown">
          <button className="dropbtn">Tickets</button>
          <div className="dropdown-content">
            <button>View Tickets</button>
          </div>
        </div>
        <div className="dropdown">
          <button className="dropbtn">Forms</button>
          <div className="dropdown-content">
            <Link to="/ticket-form" className="dropdown-item">Ticket Form</Link>
            <Link to="/engineer-form" className="dropdown-item">Engineer Form</Link>
            <Link to="/location-form" className="dropdown-item">Location Form</Link>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/contacts">
             <button className="dropbtn">Contacts</button>
           </Link>
          
        </div>
        <button>Help</button>
      </div>
      <div className="navbar-profile">
        <div className="dropdown">
          <button className="dropbtn">Profile</button>
          <div className="dropdown-content">
            <button>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
