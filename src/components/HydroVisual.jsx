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
    "2024-01-15", "2024-01-22", "2024-02-05", "2024-02-18",
    "2024-03-03", "2024-03-14", "2024-04-01", "2024-04-20",
    "2024-05-08", "2024-05-25"
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
    chartType: "bar",
    icon: "fi-rr-cloud-rain",
    description: "Acumulado diario de precipitación"
  },
  Intensidad: {
    label: "Intensidad (mm/h)",
    dataKey: "intensidad",
    color: "#f59e42",
    chartType: "line",
    icon: "fi-rr-bolt",
    description: "Tasa de precipitación por hora"
  },
  Duración: {
    label: "Duración (min)",
    dataKey: "duracion",
    color: "#10b981",
    chartType: "bar",
    icon: "fi-rr-clock",
    description: "Duración del evento de lluvia"
  }
};

export default function HydroVisualAnalysis() {
  const [selectedTab, setSelectedTab] = useState("Precipitación");
  const active = tabInfo[selectedTab];

  const chartData =
    active.chartType === "bar"
      ? {
          labels: hydroData.labels,
          datasets: [
            {
              label: active.label,
              data: hydroData[active.dataKey],
              backgroundColor: active.color
            }
          ]
        }
      : {
          labels: hydroData.labels,
          datasets: [
            {
              label: active.label,
              data: hydroData[active.dataKey],
              borderColor: active.color,
              backgroundColor: "#fff",
              pointBorderColor: active.color,
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
        ticks: { color: "#475569", maxRotation: 40, minRotation: 40 },
        grid: { color: "#f1f5f9" }
      },
      y: {
        title: { display: true, text: active.label, color: "#475569" },
        beginAtZero: true,
        grid: { color: "#f1f5f9" }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-12">
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <i className="fi fi-rr-bar-chart text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              Análisis Visual de Datos Hidrometeorológicos
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Datos de precipitación e intensidad — Santa Marta, Colombia
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="flex gap-2 mb-6">
          {Object.entries(tabInfo).map(([tab, info]) => {
            const isActive = selectedTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-500 hover:bg-gray-100 border border-transparent"
                }`}
              >
                <i className={`fi ${info.icon} text-base`}></i>
                {tab}
              </button>
            );
          })}
        </div>
        <div
          className="flex items-center gap-2 text-sm font-medium mb-5 px-3 py-2 rounded-lg w-fit"
          style={{ backgroundColor: `${active.color}15`, color: active.color }}
        >
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: active.color }}
          />
          {active.description}
        </div>
        <div className="w-full min-h-[340px] pb-2">
          {active.chartType === "bar" ? (
            <Bar data={chartData} options={options} />
          ) : (
            <Line data={chartData} options={options} />
          )}
        </div>
      </div>
    </div>
  );
}