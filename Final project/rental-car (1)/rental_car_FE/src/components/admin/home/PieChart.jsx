import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const labels = data.map((item) => item.label);
  const values = data.map((item) => item.value);

  // Bạn có thể tuỳ chỉnh màu theo nhu cầu hoặc tạo ngẫu nhiên
  const backgroundColor = ["#4caf50", "#ff9800", "#f44336"];
  const hoverBackgroundColor = ["#388e3c", "#f57c00", "#d32f2f"];

  const pieData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor,
        hoverBackgroundColor,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "User Role Overview",
      },
    },
  };

  return <Pie data={pieData} options={pieOptions} />;
};

export default PieChart;
