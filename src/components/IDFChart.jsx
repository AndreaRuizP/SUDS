import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function IDFChart({
  title = "Curvas IDF (Intensidad-Duración-Frecuencia)",
  subtitle = "Relación entre intensidad y duración para diferentes períodos de retorno",
  labels = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240],
  datasets = [
    {
      label: "T = 10 años",
      data: [0],
      borderColor: "#f87171", // rojo
      backgroundColor: "rgba(248,113,113,0.09)",
      pointBorderColor: "#f87171",
      pointBackgroundColor: "#fff",
      tension: 0.4,
      fill: false,
      borderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      showLine: true,
    }
  ]
}) {
  const data = { labels, datasets };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom"
      },
      title: { display: false }
    },
    scales: {
      x: {
        title: { display: true, text: "Duración (min)" }
      },
      y: {
        beginAtZero: true,
        suggestedMax: 320,
        title: { display: true, text: "Intensidad (mm/h)" }
      }
    },
    elements: {
      point: {
        borderWidth: 2,
        radius: 6,
        backgroundColor: "#fff"
      },
      line: {
        borderWidth: 2
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mt-12">
      <div className="flex items-center gap-3 mb-1">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <i className="fi fi-rr-trend-up text-xl"></i>
        </div>
        <span className="text-2xl font-bold text-gray-900">{title}</span>
      </div>
      <div className="text-gray-600 mb-8 mt-1">
        {subtitle}
      </div>
      <div className="w-full min-h-[380px] bg-white pt-2 pb-6 px-2">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}