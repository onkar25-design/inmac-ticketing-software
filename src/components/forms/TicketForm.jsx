import React from 'react';
import './TicketForm.css'; 
import { Form, Button, Container } from 'react-bootstrap';
import Select from 'react-select'; 
import companyLogo from './company-logo.png'; 

const companyOptions = [
  { value: 'branch1', label: 'Company - Branch 1' },
  { value: 'branch2', label: 'Company - Branch 2' },
  
];

const engineerOptions = [
  { value: 'engineer1', label: 'Engineer 1' },
  { value: 'engineer2', label: 'Engineer 2' },
  
];

const TicketForm = () => {
  return (
    <Container className="ticket-form-container mt-5">
      <img src={companyLogo} alt="Company Logo" className="company-logo-TicketForm" />
      <h2 className="text-center mb-4">Create a Ticket</h2>
      <Form className="ticket-form">
        <Form.Group className="mb-3">
          <Form.Label className="headings">Company - Branch *</Form.Label>
          <Select 
            options={companyOptions} 
            placeholder="Select Company - Branch"
            isClearable
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Description of Issue</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Describe the issue" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Serial Number</Form.Label>
          <Form.Control type="text" placeholder="Separate with comma" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Priority</Form.Label>
          <Form.Select>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Add Image</Form.Label>
          <Form.Control type="file" />
          <Form.Text className="text-muted">
            Limit 200MB per file • PNG, JPG, WEBP, JPEG
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Engineer</Form.Label>
          <Select 
            options={engineerOptions} 
            placeholder="Select Engineer"
            isClearable
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
