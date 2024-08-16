
import React, { useState } from 'react';
import './Chart.css';
import FilterForm from './FilterForm';
import BarChart from './BarChart';
import PieChart from './PieChart';
import DoughnutChart from './DoughnutChart';
import ComparisonBarChart from './ComparisonBarChart';
import { ticketPriorityData, ticketPriorityPieData, completionComparisonData, completionDoughnutData } from './fakeData';

const Chart = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [completedStatus, setCompletedStatus] = useState('all');
  const [pausedStatus, setPausedStatus] = useState('all');
  const [engineer, setEngineer] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div className="chart-container">
      <div className="chart-display">
        <div>
          <BarChart data={ticketPriorityData} />
        </div>
        <div>
          <PieChart data={ticketPriorityPieData} />
        </div>
        <div>
          <ComparisonBarChart data={completionComparisonData} />
        </div>
        <div>
          <DoughnutChart data={completionDoughnutData} />
        </div>
      </div>
      <div className="chart-filters">
        <FilterForm
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          completedStatus={completedStatus}
          setCompletedStatus={setCompletedStatus}
          pausedStatus={pausedStatus}
          setPausedStatus={setPausedStatus}
          engineer={engineer}
          setEngineer={setEngineer}
          location={location}
          setLocation={setLocation}
        />
      </div>
    </div>
  );
};

export default Chart;
