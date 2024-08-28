import React, { useState } from 'react';
import Select from 'react-select';
import './UpdateTicketForm.css';
import companyLogo from './company-logo.png';

const UpdateTicketForm = () => {
  const [priority, setPriority] = useState('Low');
  const [problemStatement, setProblemStatement] = useState('PC ISSUE');
  const [serialNumber, setSerialNumber] = useState('NA');
  const [engineer, setEngineer] = useState(null);
  const [paused, setPaused] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleFileChange = (e) => {
    console.log(e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleTogglePaused = () => {
    setPaused(!paused);
  };

  const handleToggleCompleted = () => {
    setCompleted(!completed);
  };

  const engineerOptions = [
    { value: 'Irshad Ali', label: 'Irshad Ali' },
    { value: 'John Doe', label: 'John Doe' },
    { value: 'Jane Smith', label: 'Jane Smith' },
  ];

  return (
    <div className="update-ticket-form">
      <img src={companyLogo} alt="Company Logo" className="company-logo-UpdateEngineerForm" />
      <h2>Update Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="priority" className="update-ticket-heading">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="problemStatement" className="update-ticket-heading">Problem Statement</label>
          <textarea
            id="problemStatement"
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="serialNumber" className="update-ticket-heading">Serial Number's</label>
          <input
            type="text"
            id="serialNumber"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="engineer" className="update-ticket-heading">Engineer</label>
          <Select
            id="engineer"
            options={engineerOptions}
            value={engineer}
            onChange={setEngineer}
            isSearchable
            placeholder="Select Engineer..."
          />
        </div>

        <div className="form-group toggle-group">
          <label htmlFor="paused" className="update-ticket-heading">Pause</label>
          <div
            className={`toggle-switch ${paused ? 'active' : ''}`}
            onClick={handleTogglePaused}
          >
            <div className={`slider ${paused ? 'active' : ''}`}></div>
          </div>
        </div>

        <div className="form-group">
          <label className="update-ticket-heading">Images</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <div className="form-group toggle-group">
          <label htmlFor="completed" className="update-ticket-heading">Completed</label>
          <div
            className={`toggle-switch ${completed ? 'active' : ''}`}
            onClick={handleToggleCompleted}
          >
            <div className={`slider ${completed ? 'active' : ''}`}></div>
          </div>
        </div>

        <div className="form-group">
          <label className="update-ticket-heading">Call Reports</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">Save Changes</button>
          <button type="button" className="delete-btn">Delete Ticket</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTicketForm;
