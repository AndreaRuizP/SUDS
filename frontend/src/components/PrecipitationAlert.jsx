import { useState, useEffect } from "react";

const STORAGE_KEY = "suds_precip_threshold";
const DEFAULT_THRESHOLD = 50;

export default function PrecipitationAlert({ precipitacionMaxima }) {
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(DEFAULT_THRESHOLD));

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && !isNaN(parseFloat(stored))) {
      setThreshold(parseFloat(stored));
      setDraft(stored);
    }
  }, []);

  function saveThreshold() {
    const value = parseFloat(draft);
    if (!isNaN(value) && value > 0) {
      setThreshold(value);
      localStorage.setItem(STORAGE_KEY, String(value));
    }
    setEditing(false);
  }

  const exceeded = precipitacionMaxima > threshold;

  if (editing) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 mb-6 flex items-center gap-3 flex-wrap">
        <i className="fi fi-rr-settings text-gray-500"></i>
        <span className="text-sm font-semibold text-gray-700">Umbral de alerta de precipitación (mm):</span>
        <input
          type="number"
          min="1"
          step="1"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveThreshold()}
          className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
          autoFocus
        />
        <button
          onClick={saveThreshold}
          className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition"
        >
          Guardar
        </button>
        <button
          onClick={() => { setDraft(String(threshold)); setEditing(false); }}
          className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-2 py-1.5 transition"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border px-5 py-3 mb-6 flex items-center gap-3 flex-wrap justify-between ${
        exceeded ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <i className={`fi ${exceeded ? "fi-rr-triangle-warning text-red-600" : "fi-rr-check-circle text-green-600"} text-lg`}></i>
        <span className={`text-sm font-semibold ${exceeded ? "text-red-700" : "text-green-700"}`}>
          {exceeded
            ? `Precipitación máxima registrada (${precipitacionMaxima.toFixed(1)} mm) supera el umbral de ${threshold} mm`
            : `Precipitación máxima registrada (${precipitacionMaxima.toFixed(1)} mm) dentro del umbral de ${threshold} mm`}
        </span>
      </div>
      <button
        onClick={() => setEditing(true)}
        className="text-xs font-semibold text-gray-500 hover:text-gray-700 flex items-center gap-1 transition"
      >
        <i className="fi fi-rr-settings"></i> Configurar umbral
      </button>
    </div>
  );
}
