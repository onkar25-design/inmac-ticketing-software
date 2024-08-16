import React from 'react';
import './Navbar.css';
import { FaTicketAlt } from 'react-icons/fa'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <FaTicketAlt className="ticket-icon" /> 
        <h2>Ticketing Dashboard</h2>
      </div>
      <div className="navbar-links">
        <div className="dropdown">
          <button className="dropbtn">Tickets</button>
          <div className="dropdown-content">
            <button>Edit Tickets</button>
          </div>
        </div>
        <div className="dropdown">
          <button className="dropbtn">Forms</button>
          <div className="dropdown-content">
            <button>Ticket Form</button>
            <button>Engineer Form</button>
            <button>Location Form</button>
          </div>
        </div>
        <button>Help</button>
      </div>
      <div className="navbar-profile">
        <div className="dropdown">
          <button className="dropbtn">Profile</button>
          <div className="dropdown-content">
            <button>Name</button>
            <button>Profile</button>
            <button>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
