import { useState } from "react";
import api from "../api/client";

const SUPERFICIES = [
  { label: "Asfalto",             C: 0.95 },
  { label: "Concreto",            C: 0.90 },
  { label: "Adoquín",             C: 0.85 },
  { label: "Grava",               C: 0.70 },
  { label: "Urbano Denso",        C: 0.75 },
  { label: "Urbano Residencial",  C: 0.50 },
  { label: "Mixto",               C: 0.60 },
  { label: "Césped",              C: 0.35 },
  { label: "Bosque",              C: 0.25 },
];

export default function Calcular() {
  const [superficie, setSuperficie] = useState(SUPERFICIES[5]);
  const [coefC, setCoefC]           = useState("0.5");
  const [intensidad, setIntensidad] = useState("50");
  const [duracion, setDuracion]     = useState("60");
  const [periodo, setPeriodo]       = useState("10 años");
  const [area, setArea]             = useState("1");
  const [unidad, setUnidad]         = useState("ha");

  const [loading, setLoading]   = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError]       = useState("");

  function handleSuperficieChange(e) {
    const sel = SUPERFICIES.find(s => s.label === e.target.value);
    if (sel) {
      setSuperficie(sel);
      setCoefC(String(sel.C));
    }
  }

  async function handleCalcular(e) {
    e.preventDefault();
    setError("");
    setResultado(null);

    const areaHa = unidad === "m²"
      ? parseFloat(area) / 10000
      : parseFloat(area);

    setLoading(true);
    try {
      const { data } = await api.post("/calculations/rational-method", {
        coeficiente_c:   parseFloat(coefC),
        intensidad:      parseFloat(intensidad),
        area:            areaHa,
        duracion:        parseFloat(duracion),
        periodo_retorno: periodo,
        tipo_superficie: superficie.label,
      });
      setResultado(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al calcular. Verifica los valores ingresados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-2xl p-6 mb-8 mt-2 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <i className="fi fi-rr-calculator text-xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Parámetros del Método Racional</h2>
          </div>
          <p className="text-gray-500 mt-2 ml-11">
            Configure los valores de C (escorrentía), I (intensidad) y A (área) para su análisis
          </p>
        </div>

        <form onSubmit={handleCalcular}>
          <div className="grid grid-cols-3 gap-6 mb-8">

            {/* C */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-lg leading-none">C</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-900">Coeficiente de Escorrentía</h3>
                    <p className="text-blue-500 text-xs">Fracción de precipitación que se convierte en escorrentía superficial</p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tipo de Superficie</label>
                  <select
                    value={superficie.label}
                    onChange={handleSuperficieChange}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition"
                  >
                    {SUPERFICIES.map(s => (
                      <option key={s.label} value={s.label}>{s.label} (C = {s.C})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Coeficiente C personalizado</label>
                  <input
                    type="number" step="0.01" min="0.01" max="1"
                    value={coefC}
                    onChange={e => setCoefC(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition"
                  />
                </div>
                <div className="mt-auto bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-blue-600 font-medium">Valor activo</span>
                  <span className="text-xl font-bold text-blue-700">{parseFloat(coefC || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* I */}
            <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 text-white w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-lg leading-none">I</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-green-900">IDF — Intensidad-Duración-Frecuencia</h3>
                    <p className="text-green-500 text-xs">Características de la tormenta de diseño</p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Intensidad (mm/h)</label>
                  <input
                    type="number" step="0.1" min="0.1"
                    value={intensidad}
                    onChange={e => setIntensidad(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Duración (min)</label>
                  <input
                    type="number" step="1" min="1"
                    value={duracion}
                    onChange={e => setDuracion(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Período de Retorno</label>
                  <select
                    value={periodo}
                    onChange={e => setPeriodo(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none transition"
                  >
                    <option>10 años</option>
                    <option>20 años</option>
                    <option>50 años</option>
                  </select>
                </div>
              </div>
            </div>

            {/* A */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500 text-white w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-lg leading-none">A</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-orange-900">Área de Estudio</h3>
                    <p className="text-orange-500 text-xs">Superficie donde se genera la escorrentía</p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Área</label>
                    <input
                      type="number" step="0.01" min="0.01"
                      value={area}
                      onChange={e => setArea(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Unidad</label>
                    <select
                      value={unidad}
                      onChange={e => setUnidad(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition"
                    >
                      <option value="ha">ha (hectáreas)</option>
                      <option value="m²">m²</option>
                    </select>
                  </div>
                </div>
                <div className="mt-auto bg-orange-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-orange-500 font-medium mb-0.5">Equivalencia</p>
                  <p className="text-sm font-semibold text-orange-800">1 ha = 10,000 m²</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3 mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-lg font-bold py-3.5 rounded-xl shadow-sm transition-colors disabled:opacity-60"
          >
            {loading ? "Calculando..." : "Calcular Escorrentía"}
          </button>
        </form>

        {resultado && (
          <div className="mt-8 bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
            <div className="bg-blue-600 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <i className="fi fi-rr-cloud text-white text-2xl"></i>
                <h3 className="text-white text-xl font-bold">Resultado del Cálculo</h3>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-xs font-semibold uppercase">Caudal Máximo</p>
                <p className="text-white text-4xl font-extrabold">
                  {resultado.caudal_maximo.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </p>
                <p className="text-blue-200 text-sm font-medium">Q = C × I × A</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 p-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-blue-700 font-bold uppercase">Coeficiente C</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{resultado.coeficiente_c.toFixed(2)}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-green-700 font-bold uppercase">Intensidad</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{resultado.intensidad.toFixed(2)} <span className="text-sm font-normal">mm/h</span></p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <p className="text-xs text-orange-700 font-bold uppercase">Área</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{resultado.area.toFixed(2)} <span className="text-sm font-normal">ha</span></p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-xs text-purple-700 font-bold uppercase">Duración</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{resultado.duracion} <span className="text-sm font-normal">min</span></p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 px-6 pb-6">
              <div className="bg-yellow-50 rounded-xl p-4">
                <p className="text-xs text-yellow-700 font-bold uppercase">Período de Retorno</p>
                <p className="text-lg font-bold text-yellow-800 mt-1">{resultado.periodo_retorno}</p>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-xs text-indigo-700 font-bold uppercase">Tipo de Superficie</p>
                <p className="text-lg font-bold text-indigo-800 mt-1">{resultado.tipo_superficie}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
