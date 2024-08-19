import React from 'react';
import './TicketForm.css'; 
import { Form, Button, Container } from 'react-bootstrap';

const TicketForm = () => {
  return (
    <Container className="ticket-form-container mt-5">
      <h2 className="text-center mb-4">Write a Ticket</h2>
      <Form className="ticket-form">
        <Form.Group className="mb-3">
          <Form.Label className="headings">Company - Branch *</Form.Label>
          <Form.Select>
            <option>Choose an option</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Description of Issue</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Describe the issue" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Serial Number(s)</Form.Label>
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
          <Form.Select>
            <option>Choose an option</option>
          </Form.Select>
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
