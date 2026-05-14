export default function ImportarDatos() {
  return (
    <main className=" py-8 px-8 flex-1">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 text-white p-2 h-10 rounded-lg flex-shrink-0">
              <i className="fi fi-rr-file-import text-lg"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Importar Datos</h1>
          </div>
          <p className="text-gray-600 mb-8">
            Cargue datos de la estación en formato CSV o utilice datos del IDEAM
          </p>
          <div className="space-y-4 mb-8">
            <button className="w-full border-2 border-blue-500 text-blue-600 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition">
              <i className="fi fi-rr-file-upload"></i>
              Cargar archivo .CSV
            </button>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">Formato CSV esperado:</h3>
            <code className="text-sm text-gray-700 block bg-white p-3 rounded border border-gray-200 mb-3 font-mono">
              fecha, precipitacion, intensidad, duracion
            </code>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 text-white p-2 h-10 rounded-lg flex-shrink-0">
              <i className="fi fi-rr-info text-lg"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Información del Proyecto</h2>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Objetivo del Sistema</p>
              <p className="text-gray-700 text-sm">
                Análisis de datos de precipitación utilizando el Método Racional para calcular escorrentía superficial en la Universidad Cooperativa de Colombia.
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg p-4 mt-6">
              <h4 className="font-bold mb-3">Método Racional: Q = C × I × A / 360</h4>
              <ul className="text-sm space-y-2">
                <li><strong>C</strong> - Coeficiente de escorrentía (0-1)</li>
                <li><strong>I</strong> - Intensidad de lluvia (mm/h)</li>
                <li><strong>A</strong> - Área de estudio (hectáreas)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}