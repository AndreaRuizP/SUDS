import IDBChart from "../components/IDFChart";
import HydroVisual from "../components/HydroVisual";
import ImportTable from "../components/ImportTable";

export default function Analisis() {
  return (
    <div className="p-8 min-h-screen bg-white">
      <div className="flex gap-6">
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg px-8 py-6 relative min-w-[275px]">
          <div className="absolute top-0 right-0 w-10 h-10 rounded-xl bg-blue-400 opacity-20" />
          <span className="text-white font-semibold text-md">Precipitación Máxima</span>
          <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">0.0 mm</div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg px-8 py-6 relative min-w-[275px]">
          <div className="absolute top-0 right-0 w-10 h-10 rounded-xl bg-green-300 opacity-20" />
          <span className="text-white font-semibold text-md">Precipitación Promedio</span>
          <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">0.0 mm</div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg px-8 py-6 relative min-w-[275px]">
          <div className="absolute top-0 right-0 w-10 h-10 rounded-xl bg-orange-300 opacity-20" />
          <span className="text-white font-semibold text-md">Intensidad Máxima</span>
          <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">0.0 mm/h</div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg px-8 py-6 relative min-w-[275px]">
          <div className="absolute top-0 right-0 w-10 h-10 rounded-xl bg-purple-300 opacity-20" />
          <span className="text-white font-semibold text-md">Intensidad Promedio</span>
          <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">0.0 mm/h</div>
        </div>
      </div>
      <IDBChart />
      <HydroVisual />
    <ImportTable />
    </div>
  );
}