import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const hydroData = {
  labels: [
    "2024-01-15",
    "2024-01-22",
    "2024-02-05",
    "2024-02-18",
    "2024-03-03",
    "2024-03-14",
    "2024-04-01",
    "2024-04-20",
    "2024-05-08",
    "2024-05-25"
  ],
  precipitacion: [0],
  intensidad: [0],
  duracion: [0]
};

const tabInfo = {
  Precipitación: {
    label: "Precipitación (mm)",
    dataKey: "precipitacion",
    color: "#3b82f6",
    chartType: "bar"
  },
  Intensidad: {
    label: "Intensidad (mm/h)",
    dataKey: "intensidad",
    color: "#f59e42",
    chartType: "line"
  },
  Duración: {
    label: "Duración (min)",
    dataKey: "duracion",
    color: "#10b981",
    chartType: "bar"
  }
};

export default function HydroVisualAnalysis() {
  const [selectedTab, setSelectedTab] = useState("Precipitación");
  const chartData =
    tabInfo[selectedTab].chartType === "bar"
      ? {
          labels: hydroData.labels,
          datasets: [
            {
              label: tabInfo[selectedTab].label,
              data: hydroData[tabInfo[selectedTab].dataKey],
              backgroundColor: tabInfo[selectedTab].color
            }
          ]
        }
      : {
          labels: hydroData.labels,
          datasets: [
            {
              label: tabInfo[selectedTab].label,
              data: hydroData[tabInfo[selectedTab].dataKey],
              borderColor: tabInfo[selectedTab].color,
              backgroundColor: "#fff",
              pointBorderColor: tabInfo[selectedTab].color,
              pointBackgroundColor: "#fff",
              pointRadius: 5,
              pointHoverRadius: 7,
              showLine: true,
              fill: false,
              tension: 0.4
            }
          ]
        };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "bottom" },
      title: { display: false }
    },
    scales: {
      x: {
        ticks: {
          color: "#475569",
          maxRotation: 40,
          minRotation: 40
        },
        grid: { color: "#f1f5f9" }
      },
      y: {
        title: { display: true, text: tabInfo[selectedTab].label, color: "#475569" },
        beginAtZero: true,
        grid: { color: "#f1f5f9" }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mt-12">
      <div className="flex items-center gap-3 mb-1">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <i className="fi fi-rr-bar-chart text-xl"></i>
        </div>
        <span className="text-2xl font-bold text-gray-900">
          Análisis Visual de Datos Hidrometeorológicos
        </span>
      </div>
      <div className="text-gray-600 mb-8 mt-1">
        Datos de precipitación e intensidad - Santa Marta, Colombia
      </div>
      <div className="flex bg-gray-100 rounded-xl mb-6 overflow-hidden">
        {Object.keys(tabInfo).map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={
              "flex-1 py-2 px-2 font-semibold transition " +
              (selectedTab === tab
                ? "bg-white text-blue-700 shadow-inner rounded-xl border-2 border-gray-200"
                : "text-gray-500 hover:bg-gray-200")
            }
            style={{
              boxShadow:
                selectedTab === tab
                  ? "0 1px 8px 0 rgba(0,0,0,0.05) inset"
                  : undefined,
              borderBottom:
                selectedTab === tab ? "3px solid #2563eb" : undefined
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="w-full min-h-[350px] bg-white pt-2 pb-6 px-2">
        {tabInfo[selectedTab].chartType === "bar" ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}