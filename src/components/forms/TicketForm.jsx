import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
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
  const [imageFiles, setImageFiles] = useState([]); // State for selected image files
  const [imageUrls, setImageUrls] = useState([]); // State to store image URLs
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission

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

  const handleFileChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Upload images to Supabase storage and collect their URLs
    let urls = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const fileName = `${ticketNumber}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ticket-image-client') // Ensure bucket name is correct
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError.message);
        setAlert({ show: true, message: 'Error uploading images', variant: 'danger' });
        setIsLoading(false);
        return;
      } else {
        const { data: publicData } = supabase.storage
          .from('ticket-image-client')
          .getPublicUrl(fileName);
        urls.push(publicData.publicUrl);
      }
    }
    setImageUrls(urls);

    // Insert ticket data including image URLs
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
          image_url: urls // Store multiple image URLs as an array
        }
      ]);

    if (error) {
      console.error('Error inserting data:', error.message);
      setAlert({ show: true, message: `Error creating ticket: ${error.message}`, variant: 'danger' });
    } else {
      console.log('Data inserted successfully:', data);
      setAlert({ show: true, message: 'Ticket created successfully', variant: 'success' });

      // Reset form fields
      setCompanyBranch(null);
      setDescription('');
      setSerialNumber('');
      setPriority('Low');
      setEngineer(null);
      setImageFiles([]); // Reset image files
      setImageUrls([]); // Reset image URLs
      setTicketNumber(''); // Reset ticket number
      fetchLatestTicketNumber(); // Fetch new ticket number
    }
    setIsLoading(false);
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

        <Form.Group className="mb-3">
          <Form.Label className="headings">Upload Images</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            multiple // Allow multiple files
            onChange={handleFileChange}
          />
        </Form.Group>

        <div className="text-center">
          <Button variant="danger" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Submit'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default TicketForm;
