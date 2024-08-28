import React, { useState } from 'react';
import './Navbar.css';
import { FaTicketAlt } from 'react-icons/fa'; 
import { Link } from 'react-router-dom'; 
import EngineerModal from '../forms/AddEngineerModal'; 
import TicketForm from '../forms/TicketForm';
import UpdateTicketForm from '../forms/UpdateTicketForm';


const Navbar = () => {
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [showUpdateTicketModal, setShowUpdateTicketModal] = useState(false);

  const handleAddTicket = () => setShowAddTicketModal(true);
  const handleUpdateTicket = () => setShowUpdateTicketModal(true);
  const handleCloseModal = () => {
    setShowAddTicketModal(false);
    setShowUpdateTicketModal(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <FaTicketAlt className="ticket-icon" /> 
        <Link to="/" className="navbar-heading">
          <h2>Ticket-Mitra</h2>
        </Link>
      </div>
      <div className="navbar-links">
        <div className="dropdown">
          <button className="dropbtn">Tickets</button>
          <div className="dropdown-content">
            <button className="dropdown-item" onClick={handleAddTicket}>Add Ticket</button>
            <button className="dropdown-item" onClick={handleUpdateTicket}>Update Ticket</button>
          </div>
        </div>
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

      {/* Modal for Add Ticket */}
      <EngineerModal show={showAddTicketModal} onClose={handleCloseModal}>
        <TicketForm />
      </EngineerModal>

      {/* Modal for Update Ticket */}
      <EngineerModal show={showUpdateTicketModal} onClose={handleCloseModal}>
      <UpdateTicketForm /> {/* Placeholder for update ticket form */}
      </EngineerModal>
    </nav>
  );
};

export default Navbar;
