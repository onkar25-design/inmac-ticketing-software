import React from 'react';
import './FilterForm.css'; 

const FilterForm = ({ startDate, setStartDate, endDate, setEndDate, completedStatus, setCompletedStatus, pausedStatus, setPausedStatus, engineer, setEngineer, location, setLocation }) => {
  return (
    <div className="filter-form">
      <div className="form-group">
        <label>Date:</label>
        <div className="date-range">
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </div>
      </div>
      <div className="form-group">
        <label>Completed Status:</label>
        <select value={completedStatus} onChange={(e) => setCompletedStatus(e.target.value)}>
          <option value="completed">Completed</option>
          <option value="not-completed">Not Completed</option>
          <option value="all">All</option>
        </select>
      </div>
      <div className="form-group">
        <label>Paused Status:</label>
        <select value={pausedStatus} onChange={(e) => setPausedStatus(e.target.value)}>
          <option value="paused">Paused</option>
          <option value="not-paused">Not Paused</option>
          <option value="all">All</option>
        </select>
      </div>
      <div className="form-group">
        <label>Engineer:</label>
        <select value={engineer} onChange={(e) => setEngineer(e.target.value)}>
          <option value="">Select Engineer</option>
          <option value="engineer1">Engineer 1</option>
          <option value="engineer2">Engineer 2</option>
        </select>
      </div>
      <div className="form-group">
        <label>Location:</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select Location</option>
          <option value="location1">Location 1</option>
          <option value="location2">Location 2</option>
        </select>
      </div>
    </div>
  );
};

export default FilterForm;
