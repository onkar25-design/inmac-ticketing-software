import React from 'react';
import Navbar from './components/dashboard/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import Chart from './components/dashboard/Chart'; 



function App() {
  return (
    <div className="App">
      <Navbar />
      <Dashboard />
      <Chart /> 
    </div>
  );
}

export default App;
