import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BarChart = ({ data }) => {
  return (
    <div className="chart-box">
      <Bar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false, 
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'Ticket Priority', 
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
