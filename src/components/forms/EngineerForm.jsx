import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import './EngineerForm.css'; 
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import UpdateEngineerForm from './UpdateEngineerForm';

const EngineerForm = () => {
  const [isFieldEngineer, setIsFieldEngineer] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    location: '',
    domain: ''
  });

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
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully:', data);
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
        <Col md={6} className="d-flex flex-column">
          <Form className="engineer-form" onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">Add Engineer to Database</h2>
            <Form.Group className="mb-3">
              <Form.Label className="headings">Name*</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="headings">Phone Number*</Form.Label>
              <Form.Control 
                type="number" 
                name="phone_number" 
                value={formData.phone_number} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="headings">Email ID*</Form.Label>
              <Form.Control 
                type="text" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
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
        <Col md={6}>
          <UpdateEngineerForm />
        </Col>
      </Row>
    </Container>
  );
};

export default EngineerForm;
