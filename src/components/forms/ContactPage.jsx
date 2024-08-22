import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import EngineerModal from './AddEngineerModal'; 
import EngineerForm from './EngineerForm'; 
import UpdateEngineerForm from './UpdateEngineerForm'; 
import './ContactPage.css';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const ContactPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false); 

  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleOpenUpdateModal = () => setShowUpdateModal(true); 
  const handleCloseUpdateModal = () => setShowUpdateModal(false); 

  const contactInfo = {
    name: 'John QT',
    email: 'john.qt@gmail.com',
    phone: '+1-234-567-8901',
    isFieldEngineer: true,
  };

  const pieChartData = {
    labels: ['Completed', 'Paused', 'Not Completed'],
    datasets: [
      {
        data: [40, 20, 30],
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

  return (
    <div className="contact-page">
      <div className="left-side">
        <div className="profile-section">
          <div className="contact-card">
            <div className="contact-image">
              <img src="https://via.placeholder.com/100" alt="Profile" />
            </div>
            <div className="contact-info">
              <h2>{contactInfo.name}</h2>
              <p>Data Analyst</p>
            </div>
            <button className="edit-engineer-btn" onClick={handleOpenUpdateModal}>Edit</button> 
          </div>
        </div>

        <div className="timeline-section">
          <h3>Timeline</h3>
          <div className="timeline-content">
            <ul className="timeline">
            <li className="timeline-day">
                <span className="timeline-date">Mon, 13 Aug 2024</span>
                <div className="timeline-entry completed">
                  <span className="timeline-time">9:00 am</span>
                  <p>Ticket #123456 Completed</p>
                  <p>Reviewed project documentation</p>
                </div>
                <div className="timeline-entry paused">
                  <span className="timeline-time">11:30 am</span>
                  <p>Ticket #789012 Paused</p>
                  <p>Awaiting additional information</p>
                </div>
              </li>
              <li className="timeline-day">
                <span className="timeline-date">Tue, 12 Aug 2024</span>
                <div className="timeline-entry not-completed">
                  <span className="timeline-time">10:00 am</span>
                  <p>Ticket #654321 Not Completed</p>
                  <p>Needs further investigation</p>
                </div>
                <div className="timeline-entry completed">
                  <span className="timeline-time">2:00 pm</span>
                  <p>Ticket #321456 Completed</p>
                  <p>Completed client review</p>
                </div>
              </li>
              <li className="timeline-day">
                <span className="timeline-date">Mon, 11 Aug 2024</span>
                <div className="timeline-entry completed">
                  <span className="timeline-time">9:00 am</span>
                  <p>Ticket #123456 Completed</p>
                  <p>Reviewed project documentation</p>
                </div>
                <div className="timeline-entry paused">
                  <span className="timeline-time">11:30 am</span>
                  <p>Ticket #789012 Paused</p>
                  <p>Awaiting additional information</p>
                </div>
              </li>
              <li className="timeline-day">
                <span className="timeline-date">Tue, 10 Aug 2024</span>
                <div className="timeline-entry not-completed">
                  <span className="timeline-time">10:00 am</span>
                  <p>Ticket #654321 Not Completed</p>
                  <p>Needs further investigation</p>
                </div>
                <div className="timeline-entry completed">
                  <span className="timeline-time">2:00 pm</span>
                  <p>Ticket #321456 Completed</p>
                  <p>Completed client review</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="right-side">
        <div className="right-search-bar">
          <input className="search-bar" type="text" placeholder="Search..." />
        </div>
        <div className="contact-info-box">
          <h3>Engineer Information</h3>
          <p><strong>Name:</strong> {contactInfo.name}</p>
          <p><strong>Email:</strong> {contactInfo.email}</p>
          <p><strong>Phone:</strong> {contactInfo.phone}</p>
          <p><strong>Field Engineer:</strong> {contactInfo.isFieldEngineer ? 'Yes' : 'No'}</p>
          <button className="new-engineer-btn" onClick={handleOpenAddModal}>Add Engineer</button> 
        </div>
        <div className="pie-chart-box">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>

     
      <EngineerModal show={showAddModal} onClose={handleCloseAddModal}>
        <EngineerForm />
      </EngineerModal>

      {/* Modal for updating an engineer */}
      <EngineerModal show={showUpdateModal} onClose={handleCloseUpdateModal}>
        <UpdateEngineerForm />
      </EngineerModal>
    </div>
  );
};

export default ContactPage;
