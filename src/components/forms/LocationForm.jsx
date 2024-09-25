import React, { useState, useEffect } from 'react';
import './LocationForm.css'; 
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { supabase } from '../../supabaseClient';
import { Bar } from 'react-chartjs-2';
import EngineerModal from './AddEngineerModal'; 
import UpdateLocationForm from './UpdateLocationForm'; 

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const capitalizeWords = (string) => {
  return string.split(' ').map(capitalizeFirstLetter).join(' ');
};

const AddLocationForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    branchLocation: '',
    city: '',
    contactPersonName: '',
    contactNumber: '',
    pincode: '',
    emailId: '',
    address: '',
  });

  const [alert, setAlert] = useState({
    message: '',
    variant: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [chartData, setChartData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'branchLocation' || name === 'city') {
      formattedValue = capitalizeFirstLetter(value);
    } else if (name === 'contactPersonName') {
      formattedValue = capitalizeWords(value);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { companyName, branchLocation, city, contactPersonName, contactNumber, pincode, emailId, address } = formData;

    if (contactNumber.length !== 10 || isNaN(contactNumber)) {
      setAlert({
        message: 'Contact Number must be a 10-digit number.',
        variant: 'danger',
      });
      return;
    }

    const formattedData = {
      company_name: capitalizeFirstLetter(companyName),
      branch_location: capitalizeFirstLetter(branchLocation),
      city: capitalizeFirstLetter(city),
      contact_person_name: capitalizeFirstLetter(contactPersonName),
      contact_number: contactNumber,
      pincode,
      email_id: emailId,
      address,
    };

    const { data, error } = await supabase
      .from('locations')
      .insert([formattedData]);

    if (error) {
      console.error('Error inserting data:', error);
      setAlert({
        message: 'Error inserting location. Please try again.',
        variant: 'danger',
      });
    } else {
      console.log('Data inserted successfully:', data);
      setAlert({
        message: 'Location added successfully!',
        variant: 'success',
      });

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

      fetchChartData();
    }
  };

  const fetchChartData = async () => {
    const { data, error } = await supabase
      .from('locations')
      .select('city');

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    const cityCounts = data.reduce((acc, { city }) => {
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(cityCounts);
    const values = Object.values(cityCounts);

    const newChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Number of Companies',
          data: values,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };

    setChartData(newChartData);
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <Container fluid className="location-form-container">
      <Col xs={12} md={6} className="chart-container">
        {chartData && <Bar data={chartData} options={{
          indexAxis: 'y', 
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true,
            },
          },
        }} />}
      </Col>
      <Col xs={12} md={6} className="form-container">
        <Form className="location-form" onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">Add Location</h2>
          {alert.message && (
            <Alert variant={alert.variant} className="text-center mb-4" dismissible onClose={() => setAlert({ ...alert, message: '' })}>
              {alert.message}
            </Alert>
          )}
          <Form.Group className="mb-3">
            <Form.Label className="location-form-headings">Company Name*</Form.Label>
            <Form.Control
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="location-form-headings">Branch Location*</Form.Label>
                <Form.Control
                  type="text"
                  name="branchLocation"
                  placeholder="Branch Location"
                  value={formData.branchLocation}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="location-form-headings">City*</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label className="location-form-headings">Contact Person Name*</Form.Label>
            <Form.Control
              type="text"
              name="contactPersonName"
              placeholder="Contact Person Name"
              value={formData.contactPersonName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Row>
            <Col xs={6}>
              <Form.Group className="mb-3">
                <Form.Label className="location-form-headings">Contact Number*</Form.Label>
                <Form.Control
                  type="text"
                  name="contactNumber"
                  placeholder="Enter contact number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="mb-3">
                <Form.Label className="location-form-headings">Pincode*</Form.Label>
                <Form.Control
                  type="text"
                  name="pincode"
                  placeholder="Enter pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label className="location-form-headings">Email ID*</Form.Label>
            <Form.Control
              type="email"
              name="emailId"
              placeholder="Enter email ID"
              value={formData.emailId}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="location-form-headings">Address*</Form.Label>
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
          <div className="text-center">
            <Button variant="danger" type="submit" className="me-2">
              Submit
            </Button>
            <Button
              variant="warning"
              type="button"
              onClick={() => setShowModal(true)}
            >
              Update
            </Button>
          </div>
        </Form>
      </Col>

      <EngineerModal show={showModal} onClose={() => setShowModal(false)}>
        <UpdateLocationForm />
      </EngineerModal>
    </Container>
  );
};

export default AddLocationForm;
