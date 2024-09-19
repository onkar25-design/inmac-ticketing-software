import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Select from 'react-select';
import './CallReports.css';
import { FaDownload } from 'react-icons/fa';

const CallReports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [completedStatus, setCompletedStatus] = useState([]);
  const [engineer, setEngineer] = useState([]);
  const [location, setLocation] = useState([]);
  const [priority, setPriority] = useState([]);
  const [data, setData] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const { data: ticketsData, error } = await supabase
          .from('ticket_main')
          .select('engineer, company_branch, priority');

        if (error) throw error;

        const engineersSet = new Set();
        const locationsSet = new Set();
        const prioritiesSet = new Set();

        ticketsData.forEach(ticket => {
          if (ticket.engineer) engineersSet.add(ticket.engineer);
          if (ticket.company_branch) locationsSet.add(ticket.company_branch);
          if (ticket.priority) prioritiesSet.add(ticket.priority);
        });

        setEngineers([{ value: '', label: 'All' }, ...[...engineersSet].map(eng => ({ value: eng, label: eng }))]);
        setLocations([{ value: '', label: 'All' }, ...[...locationsSet].map(loc => ({ value: loc, label: loc }))]);
        setPriorities([{ value: '', label: 'All' }, ...[...prioritiesSet].map(prio => ({ value: prio, label: prio }))]);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchFormData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query = supabase.from('ticket_main').select('*');

        if (startDate) {
          query = query.gte('created_at', new Date(startDate).toISOString());
        }
        if (endDate) {
          const endDateWithTime = new Date(endDate);
          endDateWithTime.setHours(23, 59, 59, 999);
          query = query.lte('created_at', endDateWithTime.toISOString());
        }

        const { data: fetchedData, error } = await query;
        if (error) throw error;

        let filteredData = fetchedData;

        // Filter by completed status
        if (completedStatus.length > 0) {
          filteredData = filteredData.filter(ticket => {
            const statusMatch = [];
            if (completedStatus.includes('Completed')) statusMatch.push(ticket.completed === true);
            if (completedStatus.includes('Not Completed')) statusMatch.push(ticket.completed === false);
            if (completedStatus.includes('Paused')) statusMatch.push(ticket.paused === true);
            return statusMatch.includes(true);
          });
        }

        // Filter by engineer, location, and priority
        if (engineer.length > 0) {
          filteredData = filteredData.filter(ticket => engineer.includes(ticket.engineer));
        }
        if (location.length > 0) {
          filteredData = filteredData.filter(ticket => location.includes(ticket.company_branch));
        }
        if (priority.length > 0) {
          filteredData = filteredData.filter(ticket => priority.includes(ticket.priority));
        }

        filteredData = filteredData.sort((a, b) => b.ticket_number.localeCompare(a.ticket_number));

        setData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [startDate, endDate, completedStatus, engineer, location, priority]);

  const downloadCSV = () => {
    const headers = ['Ticket Number', 'Company Branch', 'Description', 'Serial Number', 'Priority', 'Engineer', 'Paused', 'Completed', 'Created At'];

    const rows = data.map(ticket => [
      ticket.ticket_number,
      ticket.company_branch,
      ticket.description,
      ticket.serial_number,
      ticket.priority,
      ticket.engineer,
      ticket.paused ? 'Yes' : 'No',
      ticket.completed ? 'Yes' : 'No',
      new Date(ticket.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'call_reports.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="call-reports-container">
      <div className="filters-and-download-reports">
        <div className="filter-form-reports">
          <div className="form-group-reports">
            <label>Date Range:</label>
            <div className="date-range-reports">
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
          <div className="form-group-reports">
            <label>Completed Status:</label>
            <Select
              options={[
                { value: 'Completed', label: 'Completed' },
                { value: 'Not Completed', label: 'Not Completed' },
                { value: 'Paused', label: 'Paused' }
              ]}
              isMulti
              value={completedStatus.map(status => ({ value: status, label: status }))}
              onChange={(selectedOptions) => setCompletedStatus(selectedOptions.map(option => option.value))}
              placeholder="Select Status"
            />
          </div>
          <div className="form-group-reports">
            <label>Engineer:</label>
            <Select
              options={engineers}
              isMulti
              value={engineers.filter(eng => engineer.includes(eng.value))}
              onChange={(selectedOptions) => setEngineer(selectedOptions.map(option => option.value))}
              placeholder="Select Engineer"
            />
          </div>
          <div className="form-group-reports">
            <label>Location:</label>
            <Select
              options={locations}
              isMulti
              value={locations.filter(loc => location.includes(loc.value))}
              onChange={(selectedOptions) => setLocation(selectedOptions.map(option => option.value))}
              placeholder="Select Location"
            />
          </div>
          <div className="form-group-reports">
            <label>Priority:</label>
            <Select
              options={priorities}
              isMulti
              value={priorities.filter(prio => priority.includes(prio.value))}
              onChange={(selectedOptions) => setPriority(selectedOptions.map(option => option.value))}
              placeholder="Select Priority"
            />
          </div>
        </div>

        <button onClick={downloadCSV} className="download-icon-btn-reports">
          <FaDownload />
        </button>
      </div>

      <div className="table-container-reports">
        <table className="table-reports">
          <thead>
            <tr>
              <th>Ticket Number</th>
              <th>Company Branch</th>
              <th>Description</th>
              <th>Serial Number</th>
              <th>Priority</th>
              <th>Engineer</th>
              <th>Paused</th>
              <th>Completed</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map(ticket => (
                <tr key={ticket.id}>
                  <td>{ticket.ticket_number}</td>
                  <td>{ticket.company_branch}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.serial_number}</td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.engineer}</td>
                  <td>{ticket.paused ? 'Yes' : 'No'}</td>
                  <td>{ticket.completed ? 'Yes' : 'No'}</td>
                  <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CallReports;
