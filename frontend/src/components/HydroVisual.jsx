import { useState, useMemo } from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

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

const PRESETS = [
  { key: "7d",   label: "7 días" },
  { key: "30d",  label: "30 días" },
  { key: "3m",   label: "3 meses" },
  { key: "6m",   label: "6 meses" },
  { key: "todo", label: "Todo" },
];

function subtractFromDate(refDate, preset) {
  const d = new Date(refDate);
  if (preset === "7d")  d.setDate(d.getDate() - 7);
  if (preset === "30d") d.setDate(d.getDate() - 30);
  if (preset === "3m")  d.setMonth(d.getMonth() - 3);
  if (preset === "6m")  d.setMonth(d.getMonth() - 6);
  return d;
}

export default function HydroVisual({ data }) {
  const [selectedTab, setSelectedTab] = useState("Precipitación");
  const [preset, setPreset]           = useState("todo");
  const [dateFrom, setDateFrom]       = useState("");
  const [dateTo, setDateTo]           = useState("");

  const allLabels = data?.labels        ?? [];
  const allPrecip = data?.precipitacion ?? [];
  const allIntens = data?.intensidad    ?? [];
  const allDur    = data?.duracion      ?? [];

  // Fechas mín y máx del dataset
  const { minDate, maxDate, minStr, maxStr } = useMemo(() => {
    const parsed = allLabels.map(l => new Date(l)).filter(d => !isNaN(d));
    if (!parsed.length) return { minDate: null, maxDate: null, minStr: "", maxStr: "" };
    const mn = new Date(Math.min(...parsed));
    const mx = new Date(Math.max(...parsed));
    return {
      minDate: mn, maxDate: mx,
      minStr: mn.toISOString().slice(0, 10),
      maxStr: mx.toISOString().slice(0, 10),
    };
  }, [allLabels]);

  // Aplicar preset → actualiza los date inputs
  function applyPreset(key) {
    setPreset(key);
    if (!maxDate) return;
    if (key === "todo") {
      setDateFrom(minStr);
      setDateTo(maxStr);
    } else {
      setDateFrom(subtractFromDate(maxDate, key).toISOString().slice(0, 10));
      setDateTo(maxStr);
    }
  }

  // Cuando el usuario cambia manualmente las fechas → desactiva preset
  function handleDateFrom(v) {
    setDateFrom(v);
    setPreset("custom");
  }
  function handleDateTo(v) {
    setDateTo(v);
    setPreset("custom");
  }

  // Filtrar datos según el rango activo
  const { filteredLabels, filteredData } = useMemo(() => {
    if (!allLabels.length) return { filteredLabels: [], filteredData: {} };

    const from = dateFrom ? new Date(dateFrom) : null;
    const to   = dateTo   ? new Date(dateTo)   : null;
    // normalizar "to" al final del día
    if (to) to.setHours(23, 59, 59);

    const indices = allLabels.reduce((acc, label, i) => {
      const d = new Date(label);
      if (isNaN(d)) return acc;
      if (from && d < from) return acc;
      if (to   && d > to)   return acc;
      acc.push(i);
      return acc;
    }, []);

    return {
      filteredLabels: indices.map(i => allLabels[i]),
      filteredData: {
        precipitacion: indices.map(i => allPrecip[i] ?? 0),
        intensidad:    indices.map(i => allIntens[i] ?? 0),
        duracion:      indices.map(i => allDur[i]    ?? 0),
      },
    };
  }, [allLabels, allPrecip, allIntens, allDur, dateFrom, dateTo]);

  const active = tabInfo[selectedTab];
  const chartData =
    active.chartType === "bar"
      ? { labels: filteredLabels, datasets: [{ label: active.label, data: filteredData[active.dataKey] ?? [], backgroundColor: active.color }] }
      : {
          labels: filteredLabels,
          datasets: [{
            label: active.label,
            data: filteredData[active.dataKey] ?? [],
            borderColor: active.color,
            backgroundColor: "#fff",
            pointBorderColor: active.color,
            pointBackgroundColor: "#fff",
            pointRadius: filteredLabels.length > 60 ? 2 : 5,
            pointHoverRadius: 7,
            showLine: true,
            fill: false,
            tension: 0.4
          }]
        };

  const options = {
    responsive: true,
    plugins: { legend: { display: true, position: "bottom" }, title: { display: false } },
    scales: {
      x: { ticks: { color: "#475569", maxRotation: 45, minRotation: 30, autoSkip: true, maxTicksLimit: 12 }, grid: { color: "#f1f5f9" } },
      y: { title: { display: true, text: active.label, color: "#475569" }, beginAtZero: true, grid: { color: "#f1f5f9" } }
    }
  };

  const isEmpty = allLabels.length === 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-12">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
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
        {/* Filtros */}
        {!isEmpty && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <i className="fi fi-rr-filter text-gray-500 text-sm"></i>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Filtrar período</span>
              {filteredLabels.length > 0 && (
                <span className="ml-auto text-xs text-gray-400">
                  {filteredLabels.length} registros seleccionados
                </span>
              )}
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-4">
              {PRESETS.map(p => (
                <button
                  key={p.key}
                  onClick={() => applyPreset(p.key)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                    preset === p.key
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {p.label}
                </button>
              ))}
              {preset === "custom" && (
                <span className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                  Personalizado
                </span>
              )}
            </div>

            {/* Rango personalizado */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-500 uppercase w-12">Desde</label>
                <input
                  type="date"
                  value={dateFrom}
                  min={minStr}
                  max={dateTo || maxStr}
                  onChange={e => handleDateFrom(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none bg-white"
                />
              </div>
              <span className="text-gray-300 font-bold">—</span>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-500 uppercase w-12">Hasta</label>
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom || minStr}
                  max={maxStr}
                  onChange={e => handleDateTo(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none bg-white"
                />
              </div>
              {(dateFrom || dateTo) && (
                <button
                  onClick={() => { applyPreset("todo"); }}
                  className="text-xs text-gray-400 hover:text-red-500 transition flex items-center gap-1"
                >
                  <i className="fi fi-rr-cross-small"></i> Limpiar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tabs de variable */}
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
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: active.color }} />
          {active.description}
        </div>

        {/* Gráfica */}
        {isEmpty ? (
          <div className="min-h-[340px] flex items-center justify-center text-gray-400 text-sm">
            Importa un archivo CSV para visualizar los datos
          </div>
        ) : filteredLabels.length === 0 ? (
          <div className="min-h-[340px] flex items-center justify-center text-gray-400 text-sm">
            No hay datos en el período seleccionado
          </div>
        ) : (
          <div className="w-full min-h-[340px] pb-2">
            {active.chartType === "bar"
              ? <Bar data={chartData} options={options} />
              : <Line data={chartData} options={options} />}
          </div>
        )}
      </div>
    </div>
  );
}
