import React, { useState } from 'react';
import './Navbar.css';
import { FaTicketAlt, FaBars, FaTimes } from 'react-icons/fa'; 
import { Link } from 'react-router-dom'; 

const Navbar = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <FaTicketAlt className="ticket-icon" /> 
        <Link to="/" className="navbar-heading">
          <h2>Ticket-Mitra</h2>
        </Link>
      </div>

      <button className="menu-button" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`navbar-links ${isMenuOpen ? 'show' : ''}`}>
        <Link to="/support-page"> 
          <button className="dropbtn">Tickets</button>
        </Link>
        <Link to="/location-form"> 
          <button className="dropbtn">Locations</button>
        </Link>
        <Link to="/contacts">
          <button className="dropbtn">Engineers</button>
        </Link>
        <Link to="/call-reports"> 
          <button className="dropbtn">Reports</button> {/* New link */}
        </Link>
        <button>Help</button>
      </div>

      <div className={`navbar-profile ${isMenuOpen ? 'show' : ''}`}>
        <div className="dropdown">
          <button className="dropbtn">Profile</button>
          <div className="dropdown-content">
            <button onClick={onLogout}>Logout</button> 
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
