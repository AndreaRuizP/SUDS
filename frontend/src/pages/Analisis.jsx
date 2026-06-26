import { useState, useEffect } from "react";
import IDFChart from "../components/IDFChart";
import HydroVisual from "../components/HydroVisual";
import ImportTable from "../components/ImportTable";
import { useImportData } from "../context/ImportDataContext";
import api from "../api/client";

function getMax(arr) { return arr.length ? Math.max(...arr) : 0; }
function getAvg(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }

export default function Analisis() {
  const { importedData } = useImportData();

  const [idfData, setIdfData]       = useState(null);
  const [loadingIdf, setLoadingIdf] = useState(true);

  useEffect(() => {
    api.get("/calculations/idf-curves")
      .then(({ data }) => setIdfData(data))
      .catch(() => {})
      .finally(() => setLoadingIdf(false));
  }, []);

  // Extraer datos de precipitación de la columna correcta del CSV
  const precipCol = importedData?.[0]
    ? Object.keys(importedData[0]).find(k => k.toLowerCase().includes("precipit"))
    : null;

  const precipValues = precipCol
    ? importedData.map(r => parseFloat(r[precipCol]) || 0)
    : [];

  const labels = importedData.map((r, i) => r["Fecha"] || String(i + 1));

  // Intensidad aproximada (precipit × 6 para intervalo de 10 min)
  const intensidadValues = precipValues.map(v => parseFloat((v * 6).toFixed(2)));
  const duracionValues   = precipValues.map(() => 10);

  const hydroData = {
    labels,
    precipitacion: precipValues,
    intensidad: intensidadValues,
    duracion: duracionValues,
  };

  const maxPrecip = getMax(precipValues);
  const avgPrecip = getAvg(precipValues);
  const maxIntens = getMax(intensidadValues);
  const avgIntens = getAvg(intensidadValues);

  return (
    <div className="p-8 min-h-screen bg-white">
      <div className="flex gap-6 flex-wrap">
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg px-8 py-6 relative min-w-[240px]">
          <span className="text-white font-semibold text-md">Precipitación Máxima</span>
          <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            {maxPrecip.toFixed(2)} mm
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg px-8 py-6 relative min-w-[240px]">
          <span className="text-white font-semibold text-md">Precipitación Promedio</span>
          <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            {avgPrecip.toFixed(2)} mm
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg px-8 py-6 relative min-w-[240px]">
          <span className="text-white font-semibold text-md">Intensidad Máxima</span>
          <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            {maxIntens.toFixed(2)} mm/h
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg px-8 py-6 relative min-w-[240px]">
          <span className="text-white font-semibold text-md">Intensidad Promedio</span>
          <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            {avgIntens.toFixed(2)} mm/h
          </div>
        </div>
      </div>

      {loadingIdf ? (
        <div className="mt-12 text-center text-gray-400">Cargando curvas IDF...</div>
      ) : idfData ? (
        <IDFChart labels={idfData.labels} datasets={idfData.datasets} />
      ) : null}

      <HydroVisual data={hydroData} />
      <ImportTable />
    </div>
  );
}
