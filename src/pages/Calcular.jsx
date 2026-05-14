export default function Calcular() {
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
        <div className="grid grid-cols-3 gap-6 mb-8">
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
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Tipo de Superficie
                </label>
                <select className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition">
                  <option>Asfalto (C = 0.95)</option>
                  <option>Concreto (C = 0.90)</option>
                  <option>Adoquín (C = 0.85)</option>
                  <option>Grava (C = 0.70)</option>
                  <option>Urbano Denso (C = 0.75)</option>
                  <option>Urbano Residencial (C = 0.50)</option>
                  <option>Mixto (C = 0.60)</option>
                  <option>Césped (C = 0.35)</option>
                  <option>Bosque (C = 0.25)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Coeficiente C personalizado
                </label>
                <input
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition"
                  defaultValue="0.5"
                />
              </div>
              <div className="mt-auto bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-blue-600 font-medium">Valor activo</span>
                <span className="text-xl font-bold text-blue-700">0.5</span>
              </div>
            </div>
          </div>
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
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Intensidad (mm/h)
                </label>
                <input
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none transition"
                  defaultValue="50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Duración (min)
                </label>
                <input
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none transition"
                  defaultValue="60"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Período de Retorno
                </label>
                <select className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none transition">
                  <option>10 años</option>
                  <option>20 años</option>
                  <option>50 años</option>
                </select>
              </div>
            </div>
          </div>
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
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Área
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition"
                    defaultValue="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Unidad
                  </label>
                  <select className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition">
                    <option>ha (hectáreas)</option>
                    <option>m²</option>
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
        <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-lg font-bold py-3.5 rounded-xl shadow-sm transition-colors">
          Calcular Escorrentía
        </button>
      </div>
    </div>
  );
}
