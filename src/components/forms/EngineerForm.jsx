import React, { useState } from 'react';
import './EngineerForm.css'; 
import { Form, Button, Container } from 'react-bootstrap';

const EngineerForm = () => {
  const [isFieldEngineer, setIsFieldEngineer] = useState(false);

  const toggleFieldEngineer = () => {
    setIsFieldEngineer(!isFieldEngineer);
  };

  return (
    <Container className="engineer-form-container mt-5">
      <h2 className="text-center mb-4">Add Engineer to Database</h2>
      <Form className="engineer-form">
        <Form.Group className="mb-3">
          <Form.Label className="headings">Name*</Form.Label>
          <Form.Control type="text" placeholder="Name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Phone Number*</Form.Label>
          <Form.Control type="number" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Email ID*</Form.Label>
          <Form.Control type="text" />
        </Form.Group>

        <Form.Group className="mb-3 d-flex align-items-center">
          <Form.Label className="headings me-3">Field Engineer</Form.Label>
          <div className="toggle-switch" onClick={toggleFieldEngineer}>
            <div className={`slider ${isFieldEngineer ? 'active' : ''}`}></div>
          </div>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label className="headings">Location*</Form.Label>
          <Form.Control type="text" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="headings">Domain</Form.Label>
          <Form.Select>
            <option>Hardware Engineer</option>
            <option>PM Engineer</option>
            <option>Printer Engineer</option>
            <option>Other</option>
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

export default EngineerForm;
