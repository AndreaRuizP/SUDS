import { useState, useEffect, useCallback } from "react";
import api from "../api/client";
import CompareCalculos from "../components/CompareCalculos";
import { exportCalculosToCsv } from "../utils/export";

const MAX_COMPARE = 4;

export default function Historial() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [compareIds, setCompareIds] = useState([]);

  function toggleCompare(id) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }

  const fetchHistorial = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/calculations/history");
      setHistorial(data);
    } catch {
      setError("No se pudo cargar el historial.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistorial(); }, [fetchHistorial]);

  async function handleDelete(id) {
    try {
      await api.delete(`/calculations/history/${id}`);
      setHistorial(prev => prev.filter(h => h.id !== id));
      setCompareIds(prev => prev.filter(i => i !== id));
    } catch {
      setError("Error al eliminar el cálculo.");
    }
  }

  async function handleClearAll() {
    if (!window.confirm("¿Eliminar todo el historial?")) return;
    try {
      await api.delete("/calculations/history");
      setHistorial([]);
      setCompareIds([]);
    } catch {
      setError("Error al limpiar el historial.");
    }
  }

  function formatFecha(iso) {
    return new Date(iso).toLocaleString("es-CO", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="bg-[#faf7ff] border rounded-2xl p-6 flex flex-wrap items-center justify-between mb-8 shadow">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 text-white p-3 rounded-lg">
            <i className="fi fi-rr-rotate-left text-2xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Historial de Cálculos</h2>
            <p className="text-gray-600 mt-1">
              Total de cálculos realizados:{" "}
              <span className="font-bold text-gray-900">{historial.length}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => exportCalculosToCsv(historial)}
            disabled={historial.length === 0}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-5 py-2 rounded-xl shadow-sm hover:bg-gray-50 disabled:opacity-40 transition"
          >
            <i className="fi fi-rr-file-export"></i>
            Exportar a Excel (.csv)
          </button>
          <button
            onClick={handleClearAll}
            disabled={historial.length === 0}
            className="flex items-center gap-2 bg-red-500 text-white font-semibold px-5 py-2 rounded-xl shadow hover:bg-red-600 disabled:opacity-40 transition"
          >
            <i className="fi fi-rr-trash"></i>
            Limpiar Historial
          </button>
        </div>
      </div>

      {compareIds.length >= 2 && (
        <CompareCalculos
          calculos={historial.filter(h => compareIds.includes(h.id))}
          onRemove={(id) => toggleCompare(id)}
          onClear={() => setCompareIds([])}
        />
      )}

      {compareIds.length === 1 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-xl px-5 py-3 mb-6 flex items-center gap-2">
          <i className="fi fi-rr-info"></i>
          Selecciona al menos un cálculo más para comparar.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3 mb-6">{error}</div>
      )}

      {loading && (
        <div className="text-center py-16 text-gray-400 text-lg">Cargando historial...</div>
      )}

      {!loading && historial.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <i className="fi fi-rr-cloud text-5xl block mb-4 opacity-30"></i>
          <p className="text-lg font-medium">No hay cálculos guardados aún.</p>
          <p className="text-sm mt-1">Realiza un cálculo en la sección <strong>Calcular</strong>.</p>
        </div>
      )}

      {historial.map((h) => {
        const isSelected = compareIds.includes(h.id);
        return (
        <div
          key={h.id}
          className={`bg-white border rounded-2xl shadow p-6 mb-8 flex flex-col gap-4 hover:shadow-lg transition ${isSelected ? "ring-2 ring-blue-400 border-blue-300" : ""}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <label
                className="flex items-center gap-2 text-xs font-semibold text-gray-500 cursor-pointer select-none"
                title="Seleccionar para comparar"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleCompare(h.id)}
                  disabled={!isSelected && compareIds.length >= MAX_COMPARE}
                  className="w-4 h-4 accent-blue-600"
                />
                Comparar
              </label>
              <div className="bg-blue-500 text-white p-3 rounded-lg">
                <i className="fi fi-rr-cloud text-2xl"></i>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-900">Cálculo #{h.id}</div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <i className="fi fi-rr-calendar"></i>
                  <span>{formatFecha(h.fecha)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="uppercase text-gray-600 text-xs font-semibold">Caudal máximo</div>
                <div className="text-3xl font-extrabold text-blue-600">
                  {h.caudal_maximo.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </div>
              </div>
              <button
                onClick={() => handleDelete(h.id)}
                className="text-red-400 hover:text-red-600 transition p-2 rounded-lg hover:bg-red-50"
                title="Eliminar"
              >
                <i className="fi fi-rr-trash text-lg"></i>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-xl bg-blue-50 p-3">
              <div className="text-xs text-blue-800 font-bold uppercase">Coeficiente C</div>
              <div className="text-lg font-bold text-blue-900">{h.coeficiente_c.toFixed(2)}</div>
            </div>
            <div className="rounded-xl bg-cyan-50 p-3">
              <div className="text-xs text-cyan-800 font-bold uppercase">Intensidad (mm/h)</div>
              <div className="text-lg font-bold text-cyan-900">{h.intensidad.toFixed(2)}</div>
            </div>
            <div className="rounded-xl bg-green-50 p-3">
              <div className="text-xs text-green-800 font-bold uppercase">Área (ha)</div>
              <div className="text-lg font-bold text-green-900">{h.area.toFixed(2)}</div>
            </div>
            <div className="rounded-xl bg-purple-50 p-3">
              <div className="text-xs text-purple-800 font-bold uppercase">Duración (min)</div>
              <div className="text-lg font-bold text-purple-900">{h.duracion}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl bg-yellow-50 p-3">
              <div className="text-xs font-bold text-yellow-800 uppercase">Período de Retorno</div>
              <div className="font-bold text-yellow-800 text-lg">{h.periodo_retorno}</div>
            </div>
            <div className="rounded-xl bg-indigo-50 p-3">
              <div className="text-xs font-bold text-indigo-800 uppercase">Tipo de Superficie</div>
              <div className="font-bold text-indigo-800 text-lg">{h.tipo_superficie}</div>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}
