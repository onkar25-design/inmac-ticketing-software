import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import companyLogo from './company-logo.png';

const UpdateTicket = ({ ticket, onClose }) => {
  const [formData, setFormData] = useState({
    engineer: '',
    ticket_number: '',
    description: '',
    company_branch: '',
    note: '',
    note_priority: ''
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        engineer: ticket.engineer || '',
        ticket_number: ticket.ticket_number || '',
        description: ticket.description || '',
        company_branch: ticket.company_branch || '',
        note: ticket.note || '',
        note_priority: ticket.note_priority || ''
      });
    }
  }, [ticket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('ticket_main')
        .update(formData)
        .eq('id', ticket.id);

      if (error) {
        console.error('Error updating ticket:', error);
        alert('Error updating ticket.');
      } else {
        alert('Ticket updated successfully!');
        onClose();
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Error updating ticket.');
    }
  };

  return (
    <div className="uedit-support-ticket">
      <div className="modal-content">
      <img src={companyLogo} alt="Company Logo" className="company-logo-updateticketsupport" />
        <div className="modal-header">
          <h5 className="modal-title">Update Support Ticket</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <form onSubmit={handleSubmit} className="uedit-support-ticket-form">
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="engineer" className="form-label">Engineer</label>
              <input
                type="text"
                id="engineer"
                name="engineer"
                className="form-control"
                value={formData.engineer}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="ticket_number" className="form-label">Ticket Number</label>
              <input
                type="text"
                id="ticket_number"
                name="ticket_number"
                className="form-control"
                value={formData.ticket_number}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                disabled
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="company_branch" className="form-label">Company-Branch</label>
              <input
                type="text"
                id="company_branch"
                name="company_branch"
                className="form-control"
                value={formData.company_branch}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="note" className="form-label">Ticket Issue</label>
              <textarea
                id="note"
                name="note"
                className="form-control"
                value={formData.note}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="note_priority" className="form-label">Ticket Priority</label>
              <select
                id="note_priority"
                name="note_priority"
                className="form-select"
                value={formData.note_priority}
                onChange={handleChange}
              >
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTicket;
