import { Box } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

// Đăng ký các thành phần cần thiết
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = ({ chart }) => {
  const labels = chart.map(item => item.label);
  const values = chart.map(item => item.value);

  const data = {
    labels: labels, // ['01/04', '02/04', ...]
    datasets: [
      {
        label: "Daily income",
        data: values, // [0, 0, 0, ..., 1100000]
        backgroundColor: "rgba(63, 81, 181, 0.7)", // Indigo
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Daily income bar chart",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          maxRotation: 0, // không xoay nhãn
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 15, // vẫn giữ để tránh quá nhiều nhãn
        },
      },
      y: {
        grid: { color: "#eee" },
        beginAtZero: false, // không cần bắt đầu từ 0 vì bạn đặt min = 100
        min: 0,
        max: 1000000,
        ticks: {
          callback: function (value) {
            return value.toLocaleString("vi-VN") + " đ";
          },
        },
      },
    },
  };

  return (
    <Box sx={{ backgroundColor: "white", p: "20px", borderRadius: "10px" }}>
      <Bar data={data} options={options} />
    </Box>
  );
};

export default BarChart;
