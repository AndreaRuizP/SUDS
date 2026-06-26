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
      borderColor: "#f87171",
      backgroundColor: "rgba(248,113,113,0.09)",
      pointBorderColor: "#f87171",
      pointBackgroundColor: "#fff",
      tension: 0.4,
      fill: false,
      borderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      showLine: true
    }
  ]
}) {
  const data = { labels, datasets };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "bottom" }
    },
    scales: {
      x: {
        title: { display: true, text: "Duración (min)", color: "#475569" },
        grid: { color: "#f1f5f9" },
        ticks: { color: "#475569" }
      },
      y: {
        beginAtZero: true,
        suggestedMax: 320,
        title: { display: true, text: "Intensidad (mm/h)", color: "#475569" },
        grid: { color: "#f1f5f9" },
        ticks: { color: "#475569" }
      }
    },
    elements: {
      point: { borderWidth: 2, radius: 6, backgroundColor: "#fff" },
      line: { borderWidth: 2 }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-12">
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <i className="fi fi-rr-trend-up text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {title}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="flex flex-wrap gap-2 mb-5">
          {datasets.map((ds) => (
            <span
              key={ds.label}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border"
              style={{
                color: ds.borderColor,
                backgroundColor: ds.backgroundColor ?? `${ds.borderColor}15`,
                borderColor: `${ds.borderColor}40`
              }}
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: ds.borderColor }}
              />
              {ds.label}
            </span>
          ))}
        </div>

        <div className="w-full min-h-[360px] pb-2">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}