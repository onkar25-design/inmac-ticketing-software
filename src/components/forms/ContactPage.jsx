import React, { useState, useEffect, useCallback } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import EngineerModal from './AddEngineerModal';
import EngineerForm from './EngineerForm';
import UpdateEngineerForm from './UpdateEngineerForm';
import './ContactPage.css';
import { supabase } from '../../supabaseClient';
import './UpdateEngineerForm.css';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const ContactPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [engineers, setEngineers] = useState([]);
  const [initialEngineer, setInitialEngineer] = useState(null);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchInitialEngineer();
  }, []);

  useEffect(() => {
    if (selectedEngineer) {
      fetchTickets(selectedEngineer.name); 
    }
  }, [selectedEngineer]);

  const fetchInitialEngineer = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('engineers').select('*').limit(1);

    if (error) {
      setError('Error fetching initial engineer.');
      console.error('Error fetching initial engineer:', error);
    } else {
      data.forEach(engineer => {
        engineer.name = capitalizeFirstLetter(engineer.name);
      });
      setInitialEngineer(data[0]);
      setEngineers(data);
      setSelectedEngineer(data[0]); 
    }
    setLoading(false);
  }, []);

  const fetchTickets = useCallback(async (engineerName) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('ticket_main')
      .select('*')
      .ilike('engineer', `%${engineerName}%`); 

    if (error) {
      setError('Error fetching tickets.');
      console.error('Error fetching tickets:', error);
    } else {
      setTickets(data);
    }
    setLoading(false);
  }, []);

  const fetchFilteredEngineers = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('engineers')
      .select('*')
      .or(`name.ilike.%${query}%,phone_number.ilike.%${query}%,email.ilike.%${query}%`);

    if (error) {
      setError('Error fetching filtered engineers.');
      console.error('Error fetching filtered engineers:', error);
    } else {
      data.forEach(engineer => {
        engineer.name = capitalizeFirstLetter(engineer.name);
      });
      if (data.length === 0) {
        setNoResults(true);
        setEngineers([]);
      } else {
        setNoResults(false);
        setEngineers([data[0]]);
        setSelectedEngineer(data[0]); 
      }
      setSuggestions(data);
    }
    setLoading(false);
  }, []);

  const fetchSuggestions = useCallback(async (query) => {
    if (query) {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('engineers')
        .select('*')
        .or(`name.ilike.%${query}%,phone_number.ilike.%${query}%,email.ilike.%${query}%`);

      if (error) {
        setError('Error fetching suggestions.');
        console.error('Error fetching suggestions:', error);
      } else {
        data.forEach(engineer => {
          engineer.name = capitalizeFirstLetter(engineer.name);
        });
        setSuggestions(data);
      }
      setLoading(false);
    } else {
      setSuggestions([]);
    }
  }, []);

  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleOpenUpdateModal = (engineer) => {
    setSelectedEngineer(engineer);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchFilteredEngineers(searchQuery);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setEngineers([suggestion]);
    setSuggestions([]);
    setNoResults(false);
    setSelectedEngineer(suggestion); 
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setEngineers([]);
    fetchInitialEngineer();
    setNoResults(false);
  };

  const displayedEngineer = searchQuery ? engineers[0] : initialEngineer;

  const pieChartData = {
    labels: ['Completed', 'Paused', 'Not Completed'],
    datasets: [
      {
        data: [
          tickets.filter(ticket => ticket.completed).length,
          tickets.filter(ticket => ticket.paused).length,
          tickets.filter(ticket => !ticket.completed && !ticket.paused).length
        ],
        backgroundColor: ['#d4edda', '#fff3cd', '#f8d7da'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (context.parsed) {
              label += `: ${context.parsed}%`;
            }
            return label;
          },
        },
      },
      title: {
        display: true,
        text: 'Performance Overview',
        padding: {
          top: 10,
          bottom: 10,
        },
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  };

  const capitalizeFirstLetter = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const getInitial = (name) => {
    if (!name) return '';
    const [firstName] = name.split(' ');
    return firstName.charAt(0).toUpperCase();
  };

  return (
    <div className="contact-page">
      <div className="left-side">
        <div className="profile-section">
          <div className="contact-card">
            <div className="contact-image">
              {displayedEngineer ? (
                <div className="profile-initial">
                  {getInitial(displayedEngineer.name)}
                </div>
              ) : (
                <img src="https://via.placeholder.com/100" alt="Profile" />
              )}
            </div>
            <div className="contact-info">
              <h2>{displayedEngineer ? displayedEngineer.name : 'Loading...'}</h2>
              <p>{displayedEngineer ? displayedEngineer.domain : 'Loading...'}</p>
            </div>
            <button className="edit-engineer-btn" onClick={() => handleOpenUpdateModal(displayedEngineer)}>
              Edit
            </button>
          </div>
        </div>

        <div className="timeline-section">
          <h3>Engineers Timeline</h3>
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Ticket Number</th>
                  <th>Company Branch</th>
                  <th>Description</th>
                  <th>Serial Number</th>
                  <th>Priority</th>
                  <th>Engineer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr
                    key={ticket.ticket_number}
                    className={
                      ticket.completed ? 'status-completed' :
                      ticket.paused ? 'status-paused' :
                      'status-not-completed'
                    }
                  >
                    <td>{ticket.ticket_number}</td>
                    <td>{ticket.company_branch}</td>
                    <td>{ticket.description}</td>
                    <td>{ticket.serial_number}</td>
                    <td>{ticket.priority}</td>
                    <td>{ticket.engineer}</td>
                    <td>
                      {ticket.completed ? 'Completed' :
                       ticket.paused ? 'Paused' :
                       'Not Completed'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="right-side">
        <div className="right-search-bar">
          <div className="search-container">
            <input
              

              className="search-bar"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={handleClearSearch}>
                X
              </button>
            )}
          </div>
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
          {noResults && <p className="no-results-message">No such engineer found.</p>}
        </div>

        <div className="contact-info-box">
          <h3>Engineer Information</h3>
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : displayedEngineer ? (
            <>
              <p>
                <strong>Name:</strong> {displayedEngineer.name}
              </p>
              <p>
                <strong>Email:</strong> {displayedEngineer.email}
              </p>
              <p>
                <strong>Phone:</strong> {displayedEngineer.phone_number}
              </p>
              <p>
                <strong>Field Engineer:</strong> {displayedEngineer.is_field_engineer ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Location:</strong> {displayedEngineer.location || 'N/A'}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
          <button className="new-engineer-btn" onClick={handleOpenAddModal}>
            Add New Engineer
          </button>
        </div>

        <div className="chart-container-contact">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>

      {showAddModal && (
        <EngineerModal show={showAddModal} onClose={handleCloseAddModal}>
          <EngineerForm onClose={handleCloseAddModal} />
        </EngineerModal>
      )}

      {showUpdateModal && selectedEngineer && (
        <EngineerModal show={showUpdateModal} onClose={handleCloseUpdateModal}>
          <UpdateEngineerForm engineer={selectedEngineer} onClose={handleCloseUpdateModal} />
        </EngineerModal>
      )}
    </div>
  );
};

export default ContactPage;
