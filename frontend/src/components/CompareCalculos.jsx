import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BAR_COLORS = ["#2563eb", "#f59e0b", "#10b981", "#8b5cf6"];

export default function CompareCalculos({ calculos, onRemove, onClear }) {
  const labels = calculos.map((c) => `#${c.id}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Caudal máximo (m³/s)",
        data: calculos.map((c) => c.caudal_maximo),
        backgroundColor: calculos.map((_, i) => BAR_COLORS[i % BAR_COLORS.length]),
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: "#f1f5f9" } },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden mb-8 sticky top-4 z-10">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-blue-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <i className="fi fi-rr-scale text-lg"></i>
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            Comparando {calculos.length} cálculos
          </h2>
        </div>
        <button
          onClick={onClear}
          className="text-xs font-semibold text-gray-500 hover:text-red-500 transition flex items-center gap-1"
        >
          <i className="fi fi-rr-cross-small"></i> Limpiar comparación
        </button>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="min-h-[220px]">
          <Bar data={chartData} options={options} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                <th className="py-2 pr-4">Cálculo</th>
                {calculos.map((c) => (
                  <th key={c.id} className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      #{c.id}
                      <button
                        onClick={() => onRemove(c.id)}
                        className="text-gray-300 hover:text-red-500 transition"
                        title="Quitar de la comparación"
                      >
                        <i className="fi fi-rr-cross-small"></i>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-4 font-semibold text-gray-500">Coeficiente C</td>
                {calculos.map((c) => <td key={c.id} className="py-2 pr-4">{c.coeficiente_c.toFixed(2)}</td>)}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-4 font-semibold text-gray-500">Intensidad (mm/h)</td>
                {calculos.map((c) => <td key={c.id} className="py-2 pr-4">{c.intensidad.toFixed(2)}</td>)}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-4 font-semibold text-gray-500">Área (ha)</td>
                {calculos.map((c) => <td key={c.id} className="py-2 pr-4">{c.area.toFixed(2)}</td>)}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-4 font-semibold text-gray-500">Duración (min)</td>
                {calculos.map((c) => <td key={c.id} className="py-2 pr-4">{c.duracion}</td>)}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-4 font-semibold text-gray-500">Período</td>
                {calculos.map((c) => <td key={c.id} className="py-2 pr-4">{c.periodo_retorno}</td>)}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-2 pr-4 font-semibold text-gray-500">Superficie</td>
                {calculos.map((c) => <td key={c.id} className="py-2 pr-4">{c.tipo_superficie}</td>)}
              </tr>
              <tr className="border-t border-gray-100 bg-blue-50/50">
                <td className="py-2 pr-4 font-bold text-blue-700">Caudal máximo</td>
                {calculos.map((c) => (
                  <td key={c.id} className="py-2 pr-4 font-bold text-blue-700">
                    {c.caudal_maximo.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
