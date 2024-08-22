import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import './EngineerForm.css'; 
import companyLogo from './company-logo.png'; 

const EngineerForm = () => {
  const [isFieldEngineer, setIsFieldEngineer] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    location: '',
    domain: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  const toggleFieldEngineer = () => {
    setIsFieldEngineer(!isFieldEngineer);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone_number || !formData.email || !formData.location) {
      setAlert({ show: true, message: 'Please fill out all required fields', variant: 'danger' });
      return;
    }

    const { data, error } = await supabase
      .from('engineers')
      .insert([
        {
          name: formData.name,
          phone_number: formData.phone_number,
          email: formData.email,
          is_field_engineer: isFieldEngineer,
          location: formData.location,
          domain: formData.domain
        }
      ]);

    if (error) {
      setAlert({ show: true, message: 'Error inserting data', variant: 'danger' });
    } else {
      setAlert({ show: true, message: 'Engineer added successfully', variant: 'success' });
      setFormData({
        name: '',
        phone_number: '',
        email: '',
        location: '',
        domain: ''
      });
      setIsFieldEngineer(false);
    }
  };

  return (
    <Container className="engineer-form-container mt-5">
      <Row>
        <Col md={12}>
          <Form className="engineer-form" onSubmit={handleSubmit}>
            <img src={companyLogo} alt="Company Logo" className="company-logo-EngineerForm" />
            <h2 className="text-center mb-4">Add New Engineer</h2>
            {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label className="headings">Name*</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="headings">Phone Number*</Form.Label>
              <Form.Control 
                type="number" 
                name="phone_number" 
                value={formData.phone_number} 
                onChange={handleChange} 
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="headings">Email ID*</Form.Label>
              <Form.Control 
                type="text" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="headings me-3">Field Engineer</Form.Label>
              <div className="toggle-switch" onClick={toggleFieldEngineer}>
                <div className={`slider ${isFieldEngineer ? 'active' : ''}`}></div>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="headings">Location*</Form.Label>
              <Form.Control 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="headings">Domain</Form.Label>
              <Form.Select 
                name="domain" 
                value={formData.domain} 
                onChange={handleChange}
              >
                <option>Select Domain</option>
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
        </Col>
      </Row>
    </Container>
  );
};

export default EngineerForm;
