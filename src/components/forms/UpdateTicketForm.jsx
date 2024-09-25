import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Select from 'react-select';
import { Form, Button, Alert } from 'react-bootstrap';
import './UpdateTicketForm.css';
import companyLogo from './company-logo.png';

const UpdateTicketForm = () => {
  const [ticketOptions, setTicketOptions] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); 
  const [updateData, setUpdateData] = useState({
    company_branch: '',
    description: '',
    serial_number: '',
    priority: 'Low',
    engineer: '', 
    paused: false,
    completed: false,
    image_urls: [], // Handling array of image URLs
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [isLoading, setIsLoading] = useState(false); // Added isLoading state

  // Fetch tickets for selection dropdown
  useEffect(() => {
    const fetchTickets = async () => {
      const { data, error } = await supabase
        .from('ticket_main')
        .select('ticket_number, company_branch')
        .order('ticket_number', { ascending: false });

      if (error) {
        console.error('Error fetching tickets:', error);
      } else {
        setTicketOptions(
          data.map((ticket) => ({
            value: ticket.ticket_number,
            label: `${ticket.ticket_number} - ${ticket.company_branch}`,
          }))
        );
      }
    };

    fetchTickets();
  }, []);

  // Fetch selected ticket details
  useEffect(() => {
    if (selectedTicket) {
      const fetchTicketDetails = async () => {
        const { data, error } = await supabase
          .from('ticket_main')
          .select('*')
          .eq('ticket_number', selectedTicket.value)
          .single();

        if (error) {
          console.error('Error fetching ticket details:', error);
        } else {
          setUpdateData({
            company_branch: data.company_branch,
            description: data.description,
            serial_number: data.serial_number,
            priority: data.priority,
            engineer: data.engineer || '', 
            paused: data.paused,
            completed: data.completed,
            image_urls: data.callreports ? data.callreports.split(',') : [], // Split callreports into an array of URLs
          });
        }
      };

      fetchTicketDetails();
    }
  }, [selectedTicket]);

  // Handle image file change
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setImageFiles(Array.from(e.target.files));  // Store selected image files in state
    }
  };

  const handleRemoveFile = (fileName) => {
    setImageFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));  // Remove specific image file
  };

  // Function to convert UTC date to IST
  function convertUTCToIST(dateUTC) {
    // Create a new date object from the UTC date
    const dateIST = new Date(dateUTC.getTime() + (5.5 * 60 * 60 * 1000));
    return dateIST;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    let urls = [];
    // Upload images if there are any
    if (imageFiles.length > 0) {
      try {
        for (const file of imageFiles) {
          const fileName = `${Date.now()}-${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('call-reports')
            .upload(fileName, file);
  
          if (uploadError) {
            throw new Error(uploadError.message);
          }
  
          const { data: publicData, error: publicUrlError } = await supabase.storage
            .from('call-reports')
            .getPublicUrl(fileName);
  
          if (publicUrlError) {
            throw new Error(publicUrlError.message);
          }
  
          urls.push(decodeURIComponent(publicData.publicUrl));
        }
      } catch (error) {
        console.error('Error uploading images:', error.message);
        setAlert({ show: true, message: 'Error uploading images', variant: 'danger' });
        setIsLoading(false);
        return;
      }
    }
  
    const combinedImageUrls = [...updateData.image_urls, ...urls];
    const imageUrlsString = combinedImageUrls.join(',');
  
    // Conditionally set completed_at to IST if completed is true
    const completedAtIST = updateData.completed ? convertUTCToIST(new Date()).toISOString() : null;
  
    const dataToUpdate = {
      company_branch: updateData.company_branch,
      description: updateData.description,
      serial_number: updateData.serial_number,
      priority: updateData.priority,
      engineer: updateData.engineer || null,
      paused: updateData.paused,
      completed: updateData.completed,
      callreports: imageUrlsString,
      completed_at: completedAtIST, // Conditionally use IST timestamp
    };
  
    try {
      const { data, error } = await supabase
        .from('ticket_main')
        .update(dataToUpdate)
        .eq('ticket_number', selectedTicket.value);
  
      if (error) {
        throw new Error(error.message);
      }
  
      setAlert({
        show: true,
        message: 'Ticket updated successfully',
        variant: 'success',
      });
      setImageFiles([]);
      setSelectedTicket(null); // Reset selected ticket after update
      setUpdateData({
        company_branch: '',
        description: '',
        serial_number: '',
        priority: 'Low',
        engineer: '',
        paused: false,
        completed: false,
        image_urls: [],
      });
    } catch (error) {
      setAlert({
        show: true,
        message: `Error updating ticket: ${error.message}`,
        variant: 'danger',
      });
      console.error('Error updating ticket:', error);
    }
  
    setIsLoading(false);
  };
  

  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateData({
      ...updateData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleRemoveImage = (index) => {
    setUpdateData((prevData) => {
      const newImageUrls = prevData.image_urls.filter((_, i) => i !== index);
      return {
        ...prevData,
        image_urls: newImageUrls,
      };
    });
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicket) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('ticket_main')
        .delete()
        .eq('ticket_number', selectedTicket.value);

      if (error) {
        throw new Error(error.message);
      }

      setAlert({
        show: true,
        message: 'Ticket deleted successfully',
        variant: 'success',
      });
      setSelectedTicket(null); // Reset selected ticket after deletion
      setImageFiles([]);
      setUpdateData({
        company_branch: '',
        description: '',
        serial_number: '',
        priority: 'Low',
        engineer: '',
        paused: false,
        completed: false,
        image_urls: [],
      });
    } catch (error) {
      setAlert({
        show: true,
        message: `Error deleting ticket: ${error.message}`,
        variant: 'danger',
      });
      console.error('Error deleting ticket:', error);
    }

    setIsLoading(false);
  };

  const handleToggleCompleted = () => {
    const newCompletedState = !updateData.completed;
    setUpdateData({ ...updateData, completed: newCompletedState });
  };

  const dismissAlert = () => {
    setAlert({ show: false, message: '', variant: '' });
  };

  return (
    <div className="update-ticket-form">
      <img src={companyLogo} alt="Company Logo" className="company-logo-UpdateTicketForm" />
      <h2>Update Ticket</h2>
      {alert.show && (
        <Alert variant={alert.variant} onClose={dismissAlert} dismissible>
          {alert.message}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group  className="mb-3" controlId="ticketSelect">
          <Form.Label className="updateform-headings">Select Ticket</Form.Label>
          <Select
            options={ticketOptions}
            value={selectedTicket}
            onChange={(option) => setSelectedTicket(option)}
            placeholder="Select a ticket"
          />
        </Form.Group>

        {selectedTicket && (
          <>
            <Form.Group className="mb-3" controlId="company_branch">
              <Form.Label className="updateform-headings">Company Branch</Form.Label>
              <Form.Control
                type="text"
                name="company_branch"
                value={updateData.company_branch}
                onChange={handleUpdateChange}
              />
            </Form.Group>

            <Form.Group  className="mb-3" controlId="description">
              <Form.Label className="updateform-headings">Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                value={updateData.description}
                onChange={handleUpdateChange}
              />
            </Form.Group>

            <Form.Group  className="mb-3" controlId="serial_number">
              <Form.Label className="updateform-headings">Serial Number</Form.Label>
              <Form.Control
                type="text"
                name="serial_number"
                value={updateData.serial_number}
                onChange={handleUpdateChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="priority">
              <Form.Label className="updateform-headings">Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={updateData.priority}
                onChange={handleUpdateChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="form-group toggle-group">
              <Form.Label className="updateform-headings me-3">Paused</Form.Label>
              <div
                className={`toggle-switch ${updateData.paused ? 'active' : ''}`}
                onClick={() => setUpdateData({ ...updateData, paused: !updateData.paused })}
              >
                <div className="slider"></div>
              </div>
              <Form.Label className="updateform-headings">Completed</Form.Label>
              <div
                className={`toggle-switch ${updateData.completed ? 'active' : ''}`}
                onClick={handleToggleCompleted}
              >
                <div className="slider"></div>
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="engineer">
              <Form.Label className="updateform-headings">Engineer</Form.Label>
              <Form.Control
                type="text"
                name="engineer"
                value={updateData.engineer}
                onChange={handleUpdateChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="fileUpload">
              <Form.Label className="updateform-headings">Upload Images</Form.Label>
              <Form.Control type="file" multiple onChange={handleFileChange} />
              <div className="selected-images-grid">
                {imageFiles.map((file, index) => (
                  <div className="image-container" key={index}>
                    <span className="remove-image" onClick={() => handleRemoveFile(file.name)}>×</span>
                    <img src={URL.createObjectURL(file)} alt={`Selected file ${index + 1}`} className="selected-image" />
                  </div>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="existingImages">
              <Form.Label className="updateform-headings">Ticket Related Images</Form.Label>
              <div className="existing-images-grid">
                {updateData.image_urls.map((url, index) => (
                  <div className="image-container" key={index}>
                    <span className="remove-image" onClick={() => handleRemoveImage(index)}>×</span>
                    <img src={url} alt={`Existing image ${index + 1}`} className="existing-image" />
                  </div>
                ))}
              </div>
            </Form.Group>

            <div className="form-actions">
              <Button
                type="submit"
                className="save-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                className="delete-btn"
                onClick={handleDeleteTicket}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete Ticket'}
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default UpdateTicketForm;
