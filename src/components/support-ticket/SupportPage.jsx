import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrash, FaEnvelopeOpen, FaEnvelope, FaEdit } from 'react-icons/fa';
import Select from 'react-select';
import './SupportPage.css';
import { supabase } from '../../supabaseClient';
import EngineerModal from '../forms/AddEngineerModal';
import UpdateTicket from './UpdateTicket'; 

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [deletedTickets, setDeletedTickets] = useState(new Set());
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedDeletedTickets = JSON.parse(localStorage.getItem('deletedTickets')) || [];
    setDeletedTickets(new Set(savedDeletedTickets));
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from('ticket_main')
      .select('*')
      .not('note', 'is', null);

    if (error) {
      console.error('Error fetching tickets:', error);
    } else {
      setTickets(data.map(ticket => ({
        ...ticket,
        isRead: ticket.is_read,
      })));
    }
  };

  const ticketOptions = tickets
    .filter(ticket => !deletedTickets.has(ticket.id))
    .map(ticket => ({
      value: ticket.id,
      label: `${ticket.engineer} - ${ticket.ticket_number}`,
    }));

  const handleSearchChange = (selectedOption) => {
    if (selectedOption) {
      const selectedTicket = tickets.find(ticket => ticket.id === selectedOption.value);
      setSearchTerm(selectedTicket ? selectedTicket.ticket_number : '');
      setFilteredSuggestions([selectedTicket]);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredSuggestions([]);
  };

  const markAsRead = async (id) => {
    try {
      await supabase
        .from('ticket_main')
        .update({ is_read: true })
        .eq('id', id);

      setTickets(tickets.map(ticket => ticket.id === id ? { ...ticket, isRead: true } : ticket));
    } catch (error) {
      console.error('Error marking ticket as read:', error);
    }
  };

  const markAsUnread = async (id) => {
    try {
      await supabase
        .from('ticket_main')
        .update({ is_read: false })
        .eq('id', id);

      setTickets(tickets.map(ticket => ticket.id === id ? { ...ticket, isRead: false } : ticket));
    } catch (error) {
      console.error('Error marking ticket as unread:', error);
    }
  };

  const deleteNote = async (id, isRead) => {
    const isConfirmed = window.confirm('Are you sure you want to delete the note for this ticket? This action cannot be undone.');

    if (isConfirmed) {
      try {
        await supabase
          .from('ticket_main')
          .update({ note: null, note_priority: null, is_read: isRead ? false : undefined })
          .eq('id', id);

        setTickets(tickets.map(ticket => ticket.id === id ? { ...ticket, note: null, note_priority: null, isRead: isRead ? false : ticket.isRead } : ticket));
      } catch (error) {
        console.error('Error deleting note:', error);
      }

      fetchTickets();
    }
  };

  const handleEdit = (ticketId) => {
    const ticketToEdit = tickets.find(ticket => ticket.id === ticketId);
    setSelectedTicket(ticketToEdit);
    setShowModal(true);
  };

  const filteredTickets = tickets.filter(ticket => 
    !deletedTickets.has(ticket.id) && (
      ticket.engineer?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ticket.ticket_number?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const unreadTickets = filteredTickets.filter(ticket => !ticket.isRead);
  const readTickets = filteredTickets.filter(ticket => ticket.isRead);

  return (
    <div className="container my-4 support-page-ticketsupport">
      <header className="d-flex justify-content-between align-items-center mb-4 support-header-ticketsupport">
        <h1>Ticket Support</h1>
        <div className="d-flex">
          <Select
            options={ticketOptions}
            onChange={handleSearchChange}
            value={searchTerm ? ticketOptions.find(option => option.label.includes(searchTerm)) : null}
            placeholder="Search by engineer or ticket number..."
            isClearable 
            isSearchable
            onInputChange={(value) => setSearchTerm(value)}
            onBlur={() => setFilteredSuggestions([])}
          />
        </div>
        <div className="badge">{unreadTickets.length} Open Support Tickets</div>
      </header>

      <div className="tickets-section-ticketsupport">
        <h5 className="card-text-heading">Open Tickets</h5>
        {unreadTickets.length > 0 ? (
          unreadTickets.map(ticket => (
            <div
              key={ticket.id}
              className={`card mb-3 p-0 ticket-card-ticketsupport ${
                ticket.note_priority === 'High'
                  ? 'ticket-high-priority'
                  : ticket.note_priority === 'Medium'
                  ? 'ticket-medium-priority'
                  : ticket.note_priority === 'Low'
                  ? 'ticket-low-priority'
                  : 'ticket-default-priority'
              }`}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between ticket-header-ticketsupport">
                  <h5 className="card-title">{ticket.engineer}</h5>
                  <h6 className="card-subtitle text-muted">Ticket #{ticket.ticket_number}</h6>
                </div>
                <p className="card-text"><strong>Company-Branch:</strong> {ticket.company_branch}</p>
                <p className="card-text"><strong>Description:</strong> {ticket.description}</p>
                <p className="card-text"><strong>Ticket Issue:</strong> {ticket.note}</p>
                <p className="card-text"><strong>Priority:</strong> {ticket.note_priority}</p>
                <div className="d-flex justify-content-between ticket-actions-ticketsupport">
                  <div className="d-flex">
                    <button 
                      className="btn btn-sm btn-primary me-2" 
                      onClick={() => markAsRead(ticket.id)}
                    >
                      <FaEnvelopeOpen /> 
                    </button>
                    <button 
                      className="btn btn-sm btn-warning me-2" 
                      onClick={() => handleEdit(ticket.id)}
                    >
                      <FaEdit /> 
                    </button>
                  </div>
                  <button 
                    className="btn btn-sm btn-danger delete-ticket-ticketsupport" 
                    onClick={() => deleteNote(ticket.id, ticket.isRead)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No unread tickets found.</p>
        )}
      </div>

      <div className="tickets-section-ticketsupport mt-4">
        <h5 className="card-text-heading">Closed Tickets</h5>
        {readTickets.length > 0 ? (
          <table className="table table-striped table-bordered ticketsupport-table">
            <thead>
              <tr>
                <th>Engineer</th>
                <th>Company Branch</th>
                <th>Description</th>
                <th>Note</th>
                <th>Priority</th> 
                <th>Ticket #</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {readTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>{ticket.engineer}</td>
                  <td>{ticket.company_branch}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.note}</td>
                  <td>{ticket.note_priority}</td> 
                  <td>{ticket.ticket_number}</td>
                  <td>
                    <div className="ticket-actions-container-ticketsupport">
                      <button 
                        className="btn btn-sm btn-secondary me-2" 
                        onClick={() => markAsUnread(ticket.id)}
                      >
                        <FaEnvelope /> 
                      </button>
                      <button 
                        className="btn btn-sm btn-danger delete-ticket-ticketsupport" 
                        onClick={() => deleteNote(ticket.id, ticket.isRead)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No closed ticket found.</p>
        )}
      </div>

      {selectedTicket && (
        <EngineerModal show={showModal} onClose={() => setShowModal(false)}>
          <UpdateTicket ticket={selectedTicket} onClose={() => setShowModal(false)} />
        </EngineerModal>
      )}
    </div>
  );
};

export default Support;
