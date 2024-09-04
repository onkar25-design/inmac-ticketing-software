import React, { useState } from 'react';
import './Navbar.css';
import { FaTicketAlt } from 'react-icons/fa'; 
import { Link } from 'react-router-dom'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <FaTicketAlt className="ticket-icon" /> 
        <Link to="/" className="navbar-heading">
          <h2>Ticket-Mitra</h2>
        </Link>
      </div>
      <div className="navbar-links">
          <button className="dropbtn">Tickets</button>
        <Link to="/location-form"> 
          <button className="dropbtn">Location</button>
        </Link>
        <Link to="/contacts">
          <button className="dropbtn">Engineer</button>
        </Link>
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
