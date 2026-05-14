import IDBChart from "../components/IDFChart";
import HydroVisual from "../components/HydroVisual";
import ImportTable from "../components/ImportTable";
import { useImportData } from "../context/ImportDataContext";

function getMax(array, field) {
  return array.length ? Math.max(...array.map(r => +r[field] || 0)) : 0;
}
function getAvg(array, field) {
  return array.length
    ? (array.reduce((a, r) => a + (+r[field] || 0), 0) / array.length)
    : 0;
}

export default function Analisis() {
  const { importedData } = useImportData();

  const lluviaField = 'Lluvia, mm (LGR S/N: 22462775, SEN S/N: 22464947, LBL: Precipitacion)';
  const intensidadField = 'Intensidad'
  const tieneLluvia = importedData && importedData[0] && Object.keys(importedData[0]).find(key => key.toLowerCase().includes('lluvia'));
  const lluviaCol = importedData && importedData[0] && Object.keys(importedData[0]).find(k => k.toLowerCase().includes('lluvia'));
  const intensidadCol = importedData && importedData[0] && Object.keys(importedData[0]).find(k => k.toLowerCase().includes('intensid'));

  const maxPrecipitacion = lluviaCol ? getMax(importedData, lluviaCol) : 0;
  const avgPrecipitacion = lluviaCol ? getAvg(importedData, lluviaCol) : 0;
  const maxIntensidad = intensidadCol ? getMax(importedData, intensidadCol) : 0;
  const avgIntensidad = intensidadCol ? getAvg(importedData, intensidadCol) : 0;

  return (
    <div className="p-8 min-h-screen bg-white">
      <div className="flex gap-6">
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg px-8 py-6 relative min-w-[275px]">
          <div className="absolute top-0 right-0 w-10 h-10 rounded-xl bg-blue-400 opacity-20" />
          <span className="text-white font-semibold text-md">Precipitación Máxima</span>
          <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            {maxPrecipitacion.toFixed(2)} mm
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg px-8 py-6 relative min-w-[275px]">
          <div className="absolute top-0 right-0 w-10 h-10 rounded-xl bg-green-300 opacity-20" />
          <span className="text-white font-semibold text-md">Precipitación Promedio</span>
          <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            {avgPrecipitacion.toFixed(2)} mm
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg px-8 py-6 relative min-w-[275px]">
          <div className="absolute top-0 right-0 w-10 h-10 rounded-xl bg-orange-300 opacity-20" />
          <span className="text-white font-semibold text-md">Intensidad Máxima</span>
          <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            {maxIntensidad.toFixed(2)} mm/h
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg px-8 py-6 relative min-w-[275px]">
          <div className="absolute top-0 right-0 w-10 h-10 rounded-xl bg-purple-300 opacity-20" />
          <span className="text-white font-semibold text-md">Intensidad Promedio</span>
          <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            {avgIntensidad.toFixed(2)} mm/h
          </div>
        </div>
      </div>
      <IDBChart />
      <HydroVisual />
      <ImportTable />
    </div>
  );
}