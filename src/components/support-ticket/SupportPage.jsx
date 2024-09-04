import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { FaTrash } from 'react-icons/fa'; // Import a trash icon from react-icons
import './SupportPage.css'; // Custom styles

const Support = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      engineer: 'John Doe',
      ticketNumber: '001',
      priority: 'high',
      subject: 'Login Issue',
      description: 'Unable to login to the dashboard.',
      isRead: true,
    },
    {
      id: 2,
      engineer: 'Jane Smith',
      ticketNumber: '002',
      priority: 'medium',
      subject: 'Payment Failure',
      description: 'Payment gateway not responding.',
      isRead: true,
    },
    {
      id: 3,
      engineer: 'Michael Brown',
      ticketNumber: '003',
      priority: 'low',
      subject: 'Feature Request',
      description: 'Requesting a new feature for the application.',
      isRead: false,
    },
    // Add more tickets as needed
  ]);

  const markAsRead = (id) => {
    setTickets(tickets.map(ticket => ticket.id === id ? { ...ticket, isRead: true } : ticket));
  };

  const markAsUnread = (id) => {
    setTickets(tickets.map(ticket => ticket.id === id ? { ...ticket, isRead: false } : ticket));
  };

  const deleteTicket = (id) => {
    setTickets(tickets.filter(ticket => ticket.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-danger';
      case 'medium':
        return 'border-warning';
      case 'low':
        return 'border-success';
      default:
        return 'border-secondary';
    }
  };

  const unreadTickets = tickets.filter(ticket => !ticket.isRead);
  const readTickets = tickets.filter(ticket => ticket.isRead);

  return (
    <div className="container my-4 support-page">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>Ticket Support</h1>
        <input type="text" className="form-control w-25" placeholder="Search tickets..." />
        <div className="badge bg-primary">{unreadTickets.length} Open Support Tickets</div>
      </header>

      <div className="tickets-section">
        <h5>Unread Tickets</h5>
        {unreadTickets.map(ticket => (
          <div 
            key={ticket.id} 
            className={`card mb-3 p-0 ${getPriorityColor(ticket.priority)}`}
            style={{ borderLeftWidth: '5px' }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">{ticket.engineer}</h5>
                <h6 className="card-subtitle text-muted">Ticket #{ticket.ticketNumber}</h6>
              </div>
              <h6 className="card-subtitle mb-2 text-muted">Subject: {ticket.subject}</h6>
              <p className="card-text">{ticket.description}</p>
              <div className="d-flex justify-content-between">
                <div>
                  <button 
                    className="btn btn-sm btn-primary me-2" 
                    onClick={() => markAsRead(ticket.id)}
                  >
                    Mark as Read
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary" 
                    onClick={() => markAsUnread(ticket.id)}
                  >
                    Mark as Unread
                  </button>
                </div>
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => deleteTicket(ticket.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="tickets-section mt-4">
        <h5>Read Tickets</h5>
        {readTickets.map(ticket => (
          <div 
            key={ticket.id} 
            className={`card mb-3 p-0 ${getPriorityColor(ticket.priority)} bg-light`}
            style={{ borderLeftWidth: '5px' }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">{ticket.engineer}</h5>
                <h6 className="card-subtitle text-muted">Ticket #{ticket.ticketNumber}</h6>
              </div>
              <h6 className="card-subtitle mb-2 text-muted">Subject: {ticket.subject}</h6>
              <p className="card-text">{ticket.description}</p>
              <div className="d-flex justify-content-between">
                <div>
                  <button 
                    className="btn btn-sm btn-primary me-2" 
                    onClick={() => markAsRead(ticket.id)}
                  >
                    Mark as Read
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary" 
                    onClick={() => markAsUnread(ticket.id)}
                  >
                    Mark as Unread
                  </button>
                </div>
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => deleteTicket(ticket.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;
