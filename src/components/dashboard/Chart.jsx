import React, { useState, useEffect } from 'react';
import './Chart.css';
import FilterForm from './FilterForm';
import BarChart from './BarChart';
import PieChart from './PieChart';
import DoughnutChart from './DoughnutChart';
import ComparisonBarChart from './ComparisonBarChart';
import { supabase } from '../../supabaseClient';

const Chart = () => {
  const [chartData, setChartData] = useState(null); 
  const [hasInput, setHasInput] = useState(false); 

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: allTickets, error } = await supabase
          .from('ticket_main')
          .select('*');

        if (error) throw error;

        
        const priorityCounts = allTickets.reduce((acc, ticket) => {
          const ticketPriority = ticket.priority || 'Unknown';
          acc[ticketPriority] = (acc[ticketPriority] || 0) + 1;
          return acc;
        }, {});

        const backgroundColors = {
          High: '#0D7C66',
          Medium: '#41B3A2',
          Low: '#BDE8CA',
          Unknown: '#B0BEC5',
        };

        const borderColors = {
          High: '#0D7C66',
          Medium: '#41B3A2',
          Low: '#BDE8CA',
          Unknown: '#B0BEC5',
        };

        const priorityData = {
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
        };

        setChartData(priorityData);
        setHasInput(true);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <div className="chart-container-dashboard">
      <div className="chart-filters-dashboard">
        <FilterForm
          setChartData={setChartData}
          setHasInput={setHasInput}
        />
      </div>
      <div className="chart-display-dashboard">
        {chartData ? (
          <>
            <div>
              <BarChart data={chartData} />
            </div>
            <div>
              <PieChart data={chartData} />
            </div>
            <div>
              <ComparisonBarChart data={chartData} />
            </div>
            <div>
              <DoughnutChart data={chartData} />
            </div>
          </>
        ) : (
          <p>Loading charts...</p>
        )}
      </div>
    </div>
  );
};

export default Chart;
