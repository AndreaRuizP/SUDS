import { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import IDFChart from "../components/IDFChart";
import HydroVisual from "../components/HydroVisual";
import PrecipitationAlert from "../components/PrecipitationAlert";
import api from "../api/client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DONUT_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899", "#84cc16"];

function KpiCard({ label, value, unit, gradient }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${gradient} shadow-lg px-6 py-5 min-w-[180px] flex-1`}>
      <span className="text-white/90 font-semibold text-sm">{label}</span>
      <div className="text-2xl md:text-3xl font-extrabold text-white mt-2">
        {value}
        {unit && <span className="text-base font-semibold ml-1">{unit}</span>}
      </div>
    </div>
  );
}

function ChartPanel({ icon, title, subtitle, children, empty }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <i className={`fi ${icon} text-lg`}></i>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="px-6 py-6">
        {empty ? (
          <div className="min-h-[260px] flex items-center justify-center text-gray-400 text-sm">{empty}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function formatFechaCorta(iso) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

export default function Tablero() {
  const [dashboard, setDashboard] = useState(null);
  const [hydroData, setHydroData] = useState(null);
  const [idfData, setIdfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      api.get("/analysis/dashboard"),
      api.get("/analysis/hydro-data"),
      api.get("/calculations/idf-curves"),
    ])
      .then(([dashRes, hydroRes, idfRes]) => {
        setDashboard(dashRes.data);
        setHydroData(hydroRes.data);
        setIdfData(idfRes.data);
      })
      .catch(() => setError("No se pudo cargar el tablero. Intenta recargar la página."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-24 text-gray-400 text-lg">Cargando tablero...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3">{error}</div>
      </div>
    );
  }

  const { kpis, uploads_recientes, calculos_series, superficie_distribucion, periodo_distribucion } = dashboard;

  const caudalLineData = {
    labels: calculos_series.labels.map(formatFechaCorta),
    datasets: [
      {
        label: "Caudal máximo (m³/s)",
        data: calculos_series.caudal_maximo,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.08)",
        pointBackgroundColor: "#2563eb",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const superficieDonutData = {
    labels: superficie_distribucion.labels,
    datasets: [
      {
        data: superficie_distribucion.valores,
        backgroundColor: superficie_distribucion.labels.map((_, i) => DONUT_COLORS[i % DONUT_COLORS.length]),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const periodoBarData = {
    labels: periodo_distribucion.labels,
    datasets: [
      {
        label: "Cálculos",
        data: periodo_distribucion.valores,
        backgroundColor: "#8b5cf6",
        borderRadius: 6,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    plugins: { legend: { display: true, position: "bottom" } },
    scales: {
      x: { grid: { color: "#f1f5f9" }, ticks: { color: "#475569" } },
      y: { beginAtZero: true, grid: { color: "#f1f5f9" }, ticks: { color: "#475569" } },
    },
  };

  const noCalcs = calculos_series.labels.length === 0;
  const noDistribucion = superficie_distribucion.labels.length === 0;

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tablero General</h1>
          <p className="text-gray-500 mt-1">Vista consolidada de todas tus estaciones, importaciones y cálculos</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow transition"
        >
          <i className="fi fi-rr-print"></i>
          Exportar a PDF
        </button>
      </div>

      <PrecipitationAlert precipitacionMaxima={kpis.precipitacion_maxima} />

      {/* KPIs */}
      <div className="flex gap-6 flex-wrap mb-10">
        <KpiCard label="Estaciones Importadas" value={kpis.total_estaciones} gradient="from-blue-500 to-blue-600" />
        <KpiCard label="Registros Totales" value={kpis.total_registros.toLocaleString()} gradient="from-cyan-500 to-cyan-600" />
        <KpiCard label="Cálculos Realizados" value={kpis.total_calculos} gradient="from-purple-500 to-purple-600" />
        <KpiCard label="Precipitación Máxima" value={kpis.precipitacion_maxima.toFixed(1)} unit="mm" gradient="from-orange-500 to-orange-600" />
        <KpiCard label="Caudal Máximo Histórico" value={kpis.caudal_maximo.toFixed(2)} unit="m³/s" gradient="from-green-500 to-green-600" />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ChartPanel
            icon="fi-rr-stats"
            title="Evolución de Caudal Máximo"
            subtitle="Últimos cálculos realizados con el Método Racional"
            empty={noCalcs ? "Realiza cálculos en la sección Calcular para ver la tendencia" : null}
          >
            <div className="min-h-[300px]">
              <Line data={caudalLineData} options={commonOptions} />
            </div>
          </ChartPanel>
        </div>

        <ChartPanel
          icon="fi-rr-chart-pie-alt"
          title="Cálculos por Superficie"
          subtitle="Distribución por tipo de superficie"
          empty={noDistribucion ? "Aún no hay cálculos para distribuir" : null}
        >
          <div className="min-h-[300px] flex items-center justify-center">
            <Doughnut data={superficieDonutData} options={{ responsive: true, plugins: { legend: { display: true, position: "bottom", labels: { boxWidth: 12 } } } }} />
          </div>
        </ChartPanel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <ChartPanel
          icon="fi-rr-time-fast"
          title="Cálculos por Período de Retorno"
          empty={noDistribucion ? "Aún no hay cálculos para distribuir" : null}
        >
          <div className="min-h-[260px]">
            <Bar data={periodoBarData} options={commonOptions} />
          </div>
        </ChartPanel>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <i className="fi fi-rr-database text-lg"></i>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Estaciones Recientes</h2>
          </div>
          {uploads_recientes.length === 0 ? (
            <div className="min-h-[200px] flex items-center justify-center text-gray-400 text-sm">
              Importa un CSV en la sección Importar Datos
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                  <th className="px-6 py-3">Archivo</th>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3 text-right">Registros</th>
                </tr>
              </thead>
              <tbody>
                {uploads_recientes.map((u) => (
                  <tr key={u.id} className="border-t border-gray-100">
                    <td className="px-6 py-3 font-medium text-gray-800">{u.filename}</td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(u.upload_date).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-700 font-semibold">{u.row_count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {idfData && <IDFChart labels={idfData.labels} datasets={idfData.datasets} />}
      {hydroData && <HydroVisual data={hydroData} />}
    </div>
  );
}
