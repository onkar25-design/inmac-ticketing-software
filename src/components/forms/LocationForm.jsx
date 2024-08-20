import React, { useState } from 'react';
import './LocationForm.css';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { supabase } from '../../supabaseClient';
import UpdateLocationForm from './UpdateLocationForm';

const LocationForm = () => {
  const [formData, setFormData] = useState({
    branchName: '',
    address: '',
    pincode: '',
    contactPersonName: '',
    contactNumber: '',
    emailId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { branchName, address, pincode, contactPersonName, contactNumber, emailId } = formData;

    const { data, error } = await supabase
      .from('locations')
      .insert([
        {
          branch_name: branchName,
          address,
          pincode,
          contact_person_name: contactPersonName,
          contact_number: contactNumber,
          email_id: emailId
        }
      ]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully:', data);
      
      setFormData({
        branchName: '',
        address: '',
        pincode: '',
        contactPersonName: '',
        contactNumber: '',
        emailId: ''
      });
    }
  };

  return (
    <Container className="location-form-container mt-5">
      <Row>
        <Col md={6} className="d-flex flex-column">
          <Form className="location-form" onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Add Location to Database</h2>
            <Form.Group className="mb-3">
              <Form.Label className="headings">Company - Branch*</Form.Label>
              <Form.Control
                type="text"
                name="branchName"
                placeholder="Branch Name"
                value={formData.branchName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="headings">Address*</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                rows={3}
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="headings">Pincode*</Form.Label>
              <Form.Control
                type="text"
                name="pincode"
                placeholder="Enter pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="headings">Contact Person Name*</Form.Label>
              <Form.Control
                type="text"
                name="contactPersonName"
                placeholder="Contact Person Name"
                value={formData.contactPersonName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="headings">Contact Number*</Form.Label>
              <Form.Control
                type="text"
                name="contactNumber"
                placeholder="Enter contact number"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="headings">Email ID*</Form.Label>
              <Form.Control
                type="email"
                name="emailId"
                placeholder="Enter email ID"
                value={formData.emailId}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="text-center">
              <Button variant="danger" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Col>
        <Col md={6}>
          <UpdateLocationForm />
        </Col>
      </Row>
    </Container>
  );
};

export default LocationForm;
