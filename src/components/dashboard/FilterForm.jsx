import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Select from 'react-select';
import './FilterForm.css';

const FilterForm = ({ setChartData, setHasInput }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [completedStatus, setCompletedStatus] = useState('');
  const [engineer, setEngineer] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('');
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
        setPriorities([...prioritiesSet].map(prio => ({ value: prio, label: prio })));
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchFormData();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        let query = supabase.from('ticket_main').select('*');

        // Apply date range filter
        if (startDate) {
          query = query.gte('created_at', new Date(startDate).toISOString());
        }
        if (endDate) {
          const endDateWithTime = new Date(endDate);
          endDateWithTime.setHours(23, 59, 59, 999);
          query = query.lte('created_at', endDateWithTime.toISOString());
        }

        const { data: initialData, error: initialError } = await query;
        if (initialError) throw initialError;

        // Apply additional filters to the already date-filtered data
        let filteredData = initialData;

        if (completedStatus) {
          filteredData = filteredData.filter(ticket => {
            if (completedStatus === 'Completed') return ticket.completed === true;
            if (completedStatus === 'Not Completed') return ticket.completed === false;
            if (completedStatus === 'Paused') return ticket.paused === true;
            return true;
          });
        }

        if (engineer) filteredData = filteredData.filter(ticket => engineer === '' || ticket.engineer === engineer);
        if (location) filteredData = filteredData.filter(ticket => location === '' || ticket.company_branch === location);
        if (priority) filteredData = filteredData.filter(ticket => ticket.priority === priority);

        const priorityCounts = filteredData.reduce((acc, ticket) => {
          const ticketPriority = ticket.priority || 'Unknown';
          acc[ticketPriority] = (acc[ticketPriority] || 0) + 1;
          return acc;
        }, {});

        const backgroundColors = {
          High: '#0D7C66',
          Medium: '#41B3A2',
          Low: '#BDE8CA',
        };

        const borderColors = {
          High: '#0D7C66',
          Medium: '#41B3A2',
          Low: '#BDE8CA',
        };

        setChartData({
          labels: Object.keys(priorityCounts),
          datasets: [
            {
              label: 'Ticket Count',
              data: Object.values(priorityCounts),
              backgroundColor: Object.keys(priorityCounts).map(priority => backgroundColors[priority] || '#B0BEC5'),
              borderColor: Object.keys(priorityCounts).map(priority => borderColors[priority] || '#607D8B'),
              borderWidth: 1,
            },
          ],
        });

        setHasInput(true);

      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, [startDate, endDate, completedStatus, engineer, location, priority, setChartData, setHasInput]);

  return (
    <div className="filter-form">
      <div className="form-group">
        <label>Date Range:</label>
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
          <option value="">All</option>
          <option value="Completed">Completed</option>
          <option value="Not Completed">Not Completed</option>
          <option value="Paused">Paused</option>
        </select>
      </div>
      <div className="form-group">
        <label>Engineer:</label>
        <Select
          options={engineers}
          value={engineers.find(eng => eng.value === engineer)}
          onChange={(selectedOption) => setEngineer(selectedOption ? selectedOption.value : '')}
          placeholder="Select Engineer"
        />
      </div>
      <div className="form-group">
        <label>Location:</label>
        <Select
          options={locations}
          value={locations.find(loc => loc.value === location)}
          onChange={(selectedOption) => setLocation(selectedOption ? selectedOption.value : '')}
          placeholder="Select Location"
        />
      </div>
      <div className="form-group">
        <label>Priority:</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All</option>
          {priorities.map(prio => (
            <option key={prio.value} value={prio.value}>
              {prio.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterForm;
