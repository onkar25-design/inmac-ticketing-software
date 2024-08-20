import React, { useState, useEffect } from 'react';
import './LocationForm.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { supabase } from '../../supabaseClient';

const UpdateLocationForm = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    branchName: '',
    address: '',
    pincode: '',
    contactPersonName: '',
    contactNumber: '',
    emailId: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase.from('locations').select('*');
      if (error) {
        console.error('Error fetching locations:', error);
      } else {
        setLocations(data);
      }
    };
    fetchLocations();
  }, []);

  const handleLocationChange = (e) => {
    const selectedId = Number(e.target.value); 
    const location = locations.find((loc) => loc.id === selectedId);
    
    if (location) {
      setSelectedLocation(location);
      setFormData({
        branchName: location.branch_name || '',
        address: location.address || '',
        pincode: location.pincode || '',
        contactPersonName: location.contact_person_name || '',
        contactNumber: location.contact_number || '',
        emailId: location.email_id || ''
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { branchName, address, pincode, contactPersonName, contactNumber, emailId } = formData;

    const { error } = await supabase
      .from('locations')
      .update({
        branch_name: branchName,
        address,
        pincode,
        contact_person_name: contactPersonName,
        contact_number: contactNumber,
        email_id: emailId
      })
      .eq('id', selectedLocation.id);

    if (error) {
      setMessage('Error updating data: ' + error.message);
    } else {
      setMessage('Data updated successfully');
    
      setSelectedLocation(null);
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

  const handleDelete = async () => {
    if (selectedLocation) {
      if (window.confirm('Are you sure you want to delete this location?')) {
        const { error } = await supabase
          .from('locations')
          .delete()
          .eq('id', selectedLocation.id);

        if (error) {
          setMessage('Error deleting location: ' + error.message);
        } else {
          setMessage('Location deleted successfully');
          
          setSelectedLocation(null);
          setFormData({
            branchName: '',
            address: '',
            pincode: '',
            contactPersonName: '',
            contactNumber: '',
            emailId: ''
          });
          
          const { data, error } = await supabase.from('locations').select('*');
          if (error) {
            console.error('Error fetching locations:', error);
          } else {
            setLocations(data);
          }
        }
      }
    }
  };

  return (
    <Form className="location-form" onSubmit={handleSubmit}>
      <h2 className="text-center mb-4">Update Location</h2>
      {message && <Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>{message}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label className="headings">Select Location*</Form.Label>
        <Form.Select onChange={handleLocationChange} value={selectedLocation ? selectedLocation.id : ''}>
          <option value="">Select Location</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.branch_name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {selectedLocation && (
        <>
          <Form.Group className="mb-3">
            <Form.Label className="headings">Company - Branch*</Form.Label>
            <Form.Control
              type="text"
              name="branchName"
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
              value={formData.emailId}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="danger" type="submit">
              Update
            </Button>
            <Button variant="secondary" onClick={handleDelete} className="ms-3">
              Delete Location
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default UpdateLocationForm;
