import React from 'react';
import Navbar from './components/dashboard/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import Chart from './components/dashboard/Chart'; 
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="main-container">
        <Dashboard />
        <Chart /> 
      </div>
    </div>
  );
}

export default App;

