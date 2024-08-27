import React, { useState, useEffect } from 'react';
import './UpdateLocationForm.css';
import { Form, Button, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { supabase } from '../../supabaseClient';
import companyLogo from './company-logo.png'; 

const UpdateLocationForm = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    branchLocation: '',
    city: '',
    contactPersonName: '',
    contactNumber: '',
    pincode: '',
    emailId: '',
    address: ''
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

  const handleSelectChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
    if (selectedOption) {
      setFormData({
        companyName: selectedOption.company_name || '',
        branchLocation: selectedOption.branch_location || '',
        city: selectedOption.city || '',
        contactPersonName: selectedOption.contact_person_name || '',
        contactNumber: selectedOption.contact_number || '',
        pincode: selectedOption.pincode || '',
        emailId: selectedOption.email_id || '',
        address: selectedOption.address || ''
      });
    } else {
      setFormData({
        companyName: '',
        branchLocation: '',
        city: '',
        contactPersonName: '',
        contactNumber: '',
        pincode: '',
        emailId: '',
        address: ''
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
    const { companyName, branchLocation, city, contactPersonName, contactNumber, pincode, emailId, address } = formData;

    const { error } = await supabase
      .from('locations')
      .update({
        company_name: companyName,
        branch_location: branchLocation,
        city,
        contact_person_name: contactPersonName,
        contact_number: contactNumber,
        pincode,
        email_id: emailId,
        address
      })
      .eq('id', selectedLocation.id);

    if (error) {
      setMessage('Error updating data: ' + error.message);
    } else {
      setMessage('Data updated successfully');

      setSelectedLocation(null);
      setFormData({
        companyName: '',
        branchLocation: '',
        city: '',
        contactPersonName: '',
        contactNumber: '',
        pincode: '',
        emailId: '',
        address: ''
      });

      const { data, error } = await supabase.from('locations').select('*');
      if (error) {
        console.error('Error fetching locations:', error);
      } else {
        setLocations(data);
      }
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
            companyName: '',
            branchLocation: '',
            city: '',
            contactPersonName: '',
            contactNumber: '',
            pincode: '',
            emailId: '',
            address: ''
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

  // Transform location data for react-select
  const options = locations.map((loc) => ({
    value: loc.id,
    label: `${loc.company_name} - ${loc.branch_location}`,
    ...loc
  }));

  return (
    <Form className="update-location-form" onSubmit={handleSubmit}>
      <img src={companyLogo} alt="Company Logo" className="company-logo-LocationForm" />
      <h2 className="text-center mb-4">Update Location</h2>
      {message && <Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>{message}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label className="headings">Select Location*</Form.Label>
        <Select
          options={options}
          value={selectedLocation ? options.find(opt => opt.value === selectedLocation.id) : null}
          onChange={handleSelectChange}
          placeholder="Search and select location"
        />
      </Form.Group>

      {selectedLocation && (
        <>
          <Form.Group className="mb-3">
            <Form.Label className="headings">Company Name*</Form.Label>
            <Form.Control
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="headings">Branch Location*</Form.Label>
            <Form.Control
              type="text"
              name="branchLocation"
              value={formData.branchLocation}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="headings">City*</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formData.city}
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
            <Button variant="secondary" onClick={handleDelete} className=" ms-3 btn-outline-danger ">
              Delete Location
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default UpdateLocationForm;
