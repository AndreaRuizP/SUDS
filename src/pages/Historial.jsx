const historial = [
  {
    id: 17787290,
    fecha: "13 de mayo de 2026, 10:24 p. m.",
    coeficienteC: 0.5,
    intensidad: 50,
    area: 1,
    duracion: 60,
    periodoRetorno: "10 años",
    tipoSuperficie: "Mixto",
    caudalMaximo: 694.44
  }
];

export default function Historial() {
  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Panel superior */}
      <div className="bg-[#faf7ff] border rounded-2xl p-6 flex flex-wrap items-center justify-between mb-8 shadow">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 text-white p-3 rounded-lg">
            <i className="fi fi-rr-rotate-left text-2xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Historial de Cálculos
            </h2>
            <p className="text-gray-600 mt-1">
              Total de cálculos realizados:{" "}
              <span className="font-bold text-gray-900">
                {historial.length}
              </span>
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-red-500 text-white font-semibold px-5 py-2 rounded-xl shadow hover:bg-red-600 mt-4 sm:mt-0">
          <i className="fi fi-rr-trash"></i>
          Limpiar Historial
        </button>
      </div>

      {/* Historial de Cálculos */}
      {historial.map((h) => (
        <div
          key={h.id}
          className="bg-white border rounded-2xl shadow p-6 mb-8 flex flex-col gap-4 hover:shadow-lg transition cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 text-white p-3 rounded-lg">
                <i className="fi fi-rr-cloud text-2xl"></i>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-900">
                  Cálculo #{h.id}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <i className="fi fi-rr-calendar"></i>
                  <span>{h.fecha}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="uppercase text-gray-600 text-xs font-semibold">Caudal máximo</div>
              <div className="text-3xl font-extrabold text-blue-600">
                {h.caudalMaximo.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L/s
              </div>
            </div>
          </div>
          {/* Parámetros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-0">
            <div className="rounded-xl bg-blue-50 p-3">
              <div className="text-xs text-blue-800 font-bold uppercase">Coeficiente C</div>
              <div className="text-lg font-bold text-blue-900">{h.coeficienteC.toFixed(2)}</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div className="rounded-xl bg-yellow-50 p-3">
              <div className="text-xs font-bold text-yellow-800 uppercase">Período de Retorno</div>
              <div className="font-bold text-yellow-800 text-lg">{h.periodoRetorno}</div>
            </div>
            <div className="rounded-xl bg-indigo-50 p-3">
              <div className="text-xs font-bold text-indigo-800 uppercase">Tipo de Superficie</div>
              <div className="font-bold text-indigo-800 text-lg">{h.tipoSuperficie}</div>
            </div>
          </div>
          <div className="text-gray-500 italic text-sm mt-2">
            Haz clic para cargar estos parámetros en la calculadora
          </div>
        </div>
      ))}
    </div>
  );
}