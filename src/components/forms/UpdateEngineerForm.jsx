import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Form, Button, Alert } from 'react-bootstrap';
import './UpdateEngineerForm.css';
import companyLogo from './company-logo.png'; 

const UpdateEngineerForm = ({ engineer, onSave, onClose }) => {
  const [updateData, setUpdateData] = useState({
    name: '',
    phone_number: '',
    email: '',
    location: '',
    domain: '',
    is_field_engineer: false,
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    if (engineer) {
      setUpdateData({
        name: engineer.name,
        phone_number: engineer.phone_number,
        email: engineer.email,
        location: engineer.location,
        domain: engineer.domain,
        is_field_engineer: engineer.is_field_engineer,
      });
    }
  }, [engineer]);

  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateData({
      ...updateData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleToggleFieldEngineer = () => {
    setUpdateData((prevData) => ({
      ...prevData,
      is_field_engineer: !prevData.is_field_engineer,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!updateData.name || !updateData.email || !updateData.phone_number || !updateData.location) {
      setAlert({ show: true, message: 'Please fill out all required fields', variant: 'danger' });
      return;
    }

    const { error } = await supabase
      .from('engineers')
      .update(updateData)
      .eq('id', engineer.id);

    if (error) {
      setAlert({ show: true, message: 'Error updating engineer', variant: 'danger' });
    } else {
      setAlert({ show: true, message: 'Engineer updated successfully', variant: 'success' });
      if (onSave) onSave(); 
    }
  };

  const handleDeleteEngineer = async () => {
    const { error } = await supabase
      .from('engineers')
      .delete()
      .eq('id', engineer.id);

    if (error) {
      setAlert({ show: true, message: 'Error deleting engineer', variant: 'danger' });
    } else {
      setAlert({ show: true, message: 'Engineer deleted successfully', variant: 'success' });
      if (onClose) onClose(); 
    }
  };

  return (
    <div className="update-engineer-form">
      <img src={companyLogo} alt="Company Logo" className="company-logo-EngineerForm" />
      <h2 className="text-center mb-4">Update Engineer</h2>
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <Form onSubmit={handleUpdateSubmit}>
        <Form.Group className="mb-3 update-headings">
          <Form.Label>Name*</Form.Label>
          <Form.Control
            type="text"
            placeholder="Name"
            name="name"
            value={updateData.name}
            onChange={handleUpdateChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3 update-headings">
          <Form.Label>Phone Number*</Form.Label>
          <Form.Control
            type="text"
            name="phone_number"
            value={updateData.phone_number}
            onChange={handleUpdateChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3 update-headings">
          <Form.Label>Email ID*</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={updateData.email}
            onChange={handleUpdateChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3 update-headings">
          <Form.Label>Location*</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={updateData.location}
            onChange={handleUpdateChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex align-items-center">
          <Form.Label className="me-3 update-headings">Field Engineer</Form.Label>
          <div
            className={`toggle-switch ${updateData.is_field_engineer ? 'active' : ''}`}
            onClick={handleToggleFieldEngineer}
          >
            <div className={`slider ${updateData.is_field_engineer ? 'active' : ''}`}></div>
          </div>
        </Form.Group>

        <Form.Group className="mb-3 update-headings">
          <Form.Label>Domain</Form.Label>
          <Form.Select
            name="domain"
            value={updateData.domain}
            onChange={handleUpdateChange}
          >
            <option value="">Select a domain...</option>
            <option value="Hardware Engineer">Hardware Engineer</option>
            <option value="PM Engineer">PM Engineer</option>
            <option value="Printer Engineer">Printer Engineer</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Form.Group>

        <div className="text-center">
          <Button variant="danger" type="submit">
            Save Changes
          </Button>
          <Button
            variant="outline-danger"
            onClick={handleDeleteEngineer}
            className="ms-3"
          >
            Remove Engineer
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpdateEngineerForm;
