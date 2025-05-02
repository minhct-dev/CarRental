import { Paper, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";

const BarChart = ({ data }) => {
  // Lấy labels và values từ dữ liệu truyền vào
  const labels = data.map(item => item.label);
  const dailyIncome = data.map(item => item.value);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Daily Income',
        data: dailyIncome,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Income Bar Chart',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const formatter = new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            });
            return formatter.format(tooltipItem.raw);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 20000000,
        title: {
          display: true,
          text: 'Income (VND)',
        },
        ticks: {
          callback: (value) => {
            const formatter = new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            });
            return formatter.format(value);
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'All Day In Month',
        },
        ticks: {
          minRotation: 0,
          maxRotation: 0,
        },
      },
    },
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6">Daily Income</Typography>
      <Bar data={chartData} options={options} />
    </Paper>
  );
};

export default BarChart;
