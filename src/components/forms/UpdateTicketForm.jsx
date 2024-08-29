import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Select from 'react-select';
import { Form, Button, Alert } from 'react-bootstrap';
import './UpdateTicketForm.css';
import companyLogo from './company-logo.png';

const UpdateTicketForm = () => {
  const [ticketOptions, setTicketOptions] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updateData, setUpdateData] = useState({
    company_branch: '',
    description: '',
    serial_number: '',
    priority: 'Low',
    engineer: '', 
    paused: false,
    completed: false,
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    const fetchTickets = async () => {
      const { data, error } = await supabase
        .from('ticket_main')
        .select('ticket_number, company_branch')
        .order('ticket_number', { ascending: false });

      if (error) {
        console.error('Error fetching tickets:', error);
      } else {
        setTicketOptions(
          data.map((ticket) => ({
            value: ticket.ticket_number,
            label: `${ticket.ticket_number} - ${ticket.company_branch}`,
          }))
        );
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      const fetchTicketDetails = async () => {
        const { data, error } = await supabase
          .from('ticket_main')
          .select('*')
          .eq('ticket_number', selectedTicket.value)
          .single();

        if (error) {
          console.error('Error fetching ticket details:', error);
        } else {
          setUpdateData({
            company_branch: data.company_branch,
            description: data.description,
            serial_number: data.serial_number,
            priority: data.priority,
            engineer: data.engineer || '', 
            paused: data.paused,
            completed: data.completed,
          });
        }
      };

      fetchTicketDetails();
    }
  }, [selectedTicket]);

  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateData({
      ...updateData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleTogglePaused = () => {
    setUpdateData((prevData) => ({
      ...prevData,
      paused: !prevData.paused,
    }));
  };

  const handleToggleCompleted = () => {
    setUpdateData((prevData) => ({
      ...prevData,
      completed: !prevData.completed,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (
      !updateData.company_branch ||
      !updateData.description ||
      !updateData.serial_number ||
      !updateData.priority
    ) {
      setAlert({
        show: true,
        message: 'Please fill out all required fields',
        variant: 'danger',
      });
      return;
    }

    const { error } = await supabase
      .from('ticket_main')
      .update(updateData)
      .eq('ticket_number', selectedTicket.value);

    if (error) {
      setAlert({ show: true, message: 'Error updating ticket', variant: 'danger' });
    } else {
      setAlert({ show: true, message: 'Ticket updated successfully', variant: 'success' });
    }
  };

  const handleDeleteTicket = async () => {
    const { error } = await supabase
      .from('ticket_main')
      .delete()
      .eq('ticket_number', selectedTicket.value);

    if (error) {
      setAlert({ show: true, message: 'Error deleting ticket', variant: 'danger' });
    } else {
      setAlert({ show: true, message: 'Ticket deleted successfully', variant: 'success' });
      setSelectedTicket(null);
      setUpdateData({
        company_branch: '',
        description: '',
        serial_number: '',
        priority: 'Low',
        engineer: '', 
        paused: false,
        completed: false,
      });
    }
  };

  return (
    <div className="update-ticket-form">
      <img src={companyLogo} alt="Company Logo" className="company-logo-UpdateEngineerForm" />
      <h2 className="text-center mb-4">Update Ticket</h2>
      {alert.show && (
        <Alert
          variant={alert.variant}
          className="alert-dismissible"
          onClose={() => setAlert({ ...alert, show: false })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}
      <Form onSubmit={handleUpdateSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Search Ticket</Form.Label>
          <Select
            options={ticketOptions}
            value={selectedTicket}
            onChange={setSelectedTicket}
            placeholder="Select a ticket..."
          />
        </Form.Group>

        {selectedTicket && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Company Branch</Form.Label>
              <Form.Control
                type="text"
                name="company_branch"
                value={updateData.company_branch}
                onChange={handleUpdateChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={updateData.description}
                onChange={handleUpdateChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Serial Number</Form.Label>
              <Form.Control
                type="text"
                name="serial_number"
                value={updateData.serial_number}
                onChange={handleUpdateChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={updateData.priority}
                onChange={handleUpdateChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Engineer Assigned</Form.Label>
              <Form.Control
                type="text"
                name="engineer"
                value={updateData.engineer}
                onChange={handleUpdateChange} 
              />
            </Form.Group>

            <Form.Group className="form-group toggle-group">
              <Form.Label className="me-3">Paused</Form.Label>
              <div
                className={`toggle-switch ${updateData.paused ? 'active' : ''}`}
                onClick={handleTogglePaused}
              >
                <div className={`slider ${updateData.paused ? 'active' : ''}`}></div>
              </div>
            </Form.Group>

            <Form.Group className="form-group toggle-group">
              <Form.Label className="me-3">Completed</Form.Label>
              <div
                className={`toggle-switch ${updateData.completed ? 'active' : ''}`}
                onClick={handleToggleCompleted}
              >
                <div className={`slider ${updateData.completed ? 'active' : ''}`}></div>
              </div>
            </Form.Group>

            <div className="form-actions">
              <Button className="save-btn" type="submit">
                Save Changes
              </Button>
              <Button className="delete-btn" onClick={handleDeleteTicket}>
                Delete Ticket
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default UpdateTicketForm;
