import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const DoughnutChart = ({ data }) => {
  return (
    <div className="chart-box">
      <Doughnut
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
              text: 'Ticket Completion Status', 
            },
          },
        }}
      />
    </div>
  );
};

export default DoughnutChart;
