import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Form, Button, Alert } from 'react-bootstrap';
import './UpdateEngineerForm.css';
import companyLogo from './company-logo.png'; 

const UpdateEngineerForm = () => {
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
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
    const fetchEngineers = async () => {
      const { data: engineers, error } = await supabase
        .from('engineers')
        .select('id, name');
      if (error) {
        console.error('Error fetching engineers:', error);
      } else {
        setEngineers(engineers);
        if (engineers.length === 1) {
          handleSelectEngineer({ target: { value: engineers[0].id } });
        }
      }
    };

    fetchEngineers();
  }, []);

  const handleSelectEngineer = async (e) => {
    const id = e.target.value;
    setSelectedEngineer(id);
    const { data, error } = await supabase
      .from('engineers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      setAlert({ show: true, message: 'Error fetching engineer details', variant: 'danger' });
    } else {
      setUpdateData(data);
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateData({
      ...updateData,
      [e.target.name]: e.target.value,
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

    const { data, error } = await supabase
      .from('engineers')
      .update(updateData)
      .eq('id', selectedEngineer);

    if (error) {
      setAlert({ show: true, message: 'Error updating engineer', variant: 'danger' });
    } else {
      setAlert({ show: true, message: 'Engineer updated successfully', variant: 'success' });
      setSelectedEngineer(null);
      setUpdateData({
        name: '',
        phone_number: '',
        email: '',
        location: '',
        domain: '',
        is_field_engineer: false,
      });
    }
  };

  const handleDeleteEngineer = async () => {
    const { data, error } = await supabase
      .from('engineers')
      .delete()
      .eq('id', selectedEngineer);

    if (error) {
      setAlert({ show: true, message: 'Error deleting engineer', variant: 'danger' });
    } else {
      setAlert({ show: true, message: 'Engineer deleted successfully', variant: 'success' });
      setSelectedEngineer(null);
      setUpdateData({
        name: '',
        phone_number: '',
        email: '',
        location: '',
        domain: '',
        is_field_engineer: false,
      });
    }
  };

  return (
    <div className="update-engineer-container">
      <img src={companyLogo} alt="Company Logo" className="company-logo-UpdateEngineerForm" />
      <h2 className="text-center mb-4">Update Engineer</h2>
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <Form onSubmit={handleUpdateSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="headings">Select Engineer</Form.Label>
          <Form.Select onChange={handleSelectEngineer} value={selectedEngineer || ''}>
            <option value="" disabled>Select an engineer...</option>
            {engineers.map((engineer) => (
              <option key={engineer.id} value={engineer.id}>
                {engineer.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {selectedEngineer && (
          <>
            <Form.Group className="mb-3">
              <Form.Label className="headings">Name*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={updateData.name}
                onChange={handleUpdateChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="headings">Phone Number*</Form.Label>
              <Form.Control
                type="number"
                name="phone_number"
                value={updateData.phone_number}
                onChange={handleUpdateChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="headings">Email ID*</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={updateData.email}
                onChange={handleUpdateChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="headings">Location*</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={updateData.location}
                onChange={handleUpdateChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="headings me-3">Field Engineer</Form.Label>
              <div
                className={`toggle-switch ${updateData.is_field_engineer ? 'active' : ''}`}
                onClick={handleToggleFieldEngineer}
              >
                <div className={`slider ${updateData.is_field_engineer ? 'active' : ''}`}></div>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="headings">Domain</Form.Label>
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
          </>
        )}
      </Form>
    </div>
  );
};

export default UpdateEngineerForm;
