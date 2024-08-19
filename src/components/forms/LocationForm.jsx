import React from 'react';
import './LocationForm.css'; 
import { Form, Button, Container } from 'react-bootstrap';

const LocationForm = () => {
  return (
    <Container className="ticket-form-container mt-5">
      <h2 className="text-center mb-4">Add Location to DataBase</h2>
      <Form className="ticket-form">
      <Form.Group className="mb-3">
          <Form.Label className="headings">Company -Branch*</Form.Label>
          <Form.Control type="text" placeholder="Branch Name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Address*</Form.Label>
          <Form.Control as="textarea" rows={3}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Pincode*</Form.Label>
          <Form.Control type="text"/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Contact Person Name*</Form.Label>
          <Form.Control type="text"/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Contact Number*</Form.Label>
          <Form.Control type="number"/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Email ID*</Form.Label>
          <Form.Control type="text"/>
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

export default LocationForm;
