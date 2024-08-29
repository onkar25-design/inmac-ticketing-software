import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap'; 
import Select from 'react-select';
import { supabase } from '../../supabaseClient';
import './TicketForm.css'; 
import companyLogo from './company-logo.png';

const TicketForm = () => {
  const [companyBranch, setCompanyBranch] = useState(null);
  const [description, setDescription] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [priority, setPriority] = useState('Low');
  const [engineer, setEngineer] = useState(null);
  const [engineerOptions, setEngineerOptions] = useState([]); 
  const [companyOptions, setCompanyOptions] = useState([]); 
  const [ticketNumber, setTicketNumber] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' }); 

  const fetchLatestTicketNumber = async () => {
    const { data, error } = await supabase
      .from('ticket_main')
      .select('ticket_number')
      .order('id', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching latest ticket number:', error.message);
    } else if (data.length > 0) {
      const latestNumber = parseInt(data[0].ticket_number.substring(1)) + 1;
      const newTicketNumber = `T${latestNumber.toString().padStart(5, '0')}`;
      setTicketNumber(newTicketNumber);
    } else {
      setTicketNumber('T00001');
    }
  };

  const fetchEngineers = async () => {
    const { data, error } = await supabase
      .from('engineers') 
      .select('name');

    if (error) {
      console.error('Error fetching engineers:', error.message);
    } else {
      const options = data.map(engineer => ({
        value: engineer.name,
        label: engineer.name,
      }));
      setEngineerOptions(options);
    }
  };

  const fetchCompanyBranches = async () => {
    const { data, error } = await supabase
      .from('locations') 
      .select('company_name, branch_location');

    if (error) {
      console.error('Error fetching company branches:', error.message);
    } else {
      const options = data.map(location => ({
        value: `${location.company_name}-${location.branch_location}`,
        label: `${location.company_name} - ${location.branch_location}`,
      }));
      setCompanyOptions(options);
    }
  };

  useEffect(() => {
    fetchLatestTicketNumber();
    fetchEngineers();
    fetchCompanyBranches(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('ticket_main')
      .insert([
        {
          company_branch: companyBranch?.value,
          description,
          serial_number: serialNumber,
          priority,
          engineer: engineer?.value,
          ticket_number: ticketNumber,
        }
      ]);

    if (error) {
      console.error('Error inserting data:', error.message);
      setAlert({ show: true, message: 'Error creating Ticket: ', variant: 'danger' });
    } else {
      console.log('Data inserted successfully:', data);
      setAlert({ show: true, message: 'Ticket created successfully', variant: 'success' });

      setCompanyBranch(null);
      setDescription('');
      setSerialNumber('');
      setPriority('Low');
      setEngineer(null);

      fetchLatestTicketNumber();
    }
  };

  return (
    <Container className="ticket-form-container mt-5">
      <img src={companyLogo} alt="Company Logo" className="company-logo-TicketForm" />
      <h2 className="text-center mb-4">
        Create a Ticket: {ticketNumber}
      </h2>

      {alert.show && (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert({ show: false, message: '', variant: '' })}
          dismissible
          className="alert-dismissible"
        >
          {alert.message}
        </Alert>
      )}

      <Form className="ticket-form" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="headings">Company - Branch *</Form.Label>
          <Select
            options={companyOptions}
            placeholder="Select Company - Branch"
            isClearable
            onChange={setCompanyBranch}
            value={companyBranch}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Description of Issue</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Describe the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Serial Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Separate with comma"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Priority</Form.Label>
          <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Engineer</Form.Label>
          <Select
            options={engineerOptions}
            placeholder="Select Engineer"
            isClearable
            onChange={setEngineer}
            value={engineer}
          />
        </Form.Group>

        <div className="text-center">
          <Button variant="danger" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default TicketForm;
