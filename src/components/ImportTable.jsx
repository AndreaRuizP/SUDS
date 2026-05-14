const importedData = [
  { fecha: "2024-01-15", precipitacion: 0.0, intensidad: 0.0, duracion: 0 },
 
];

export default function ImportedDataTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mt-12">
      <h2 className="text-xl font-bold text-gray-900">Tabla de Datos Importados</h2>
      <p className="text-gray-500 mb-4">Datos completos de precipitación (10 registros)</p>
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-white bg-blue-600">
                Fecha
              </th>
              <th className="py-3 px-4 text-left font-semibold text-white bg-blue-600">
                Precipitación (mm)
              </th>
              <th className="py-3 px-4 text-left font-semibold text-white bg-blue-600">
                Intensidad (mm/h)
              </th>
              <th className="py-3 px-4 text-left font-semibold text-white bg-blue-600">
                Duración (min)
              </th>
            </tr>
          </thead>
          <tbody>
            {importedData.map((row, idx) => (
              <tr key={idx} className="border-b last:border-b-0 border-gray-100">
                <td className="py-3 px-4 font-semibold">{row.fecha}</td>
                <td className="py-3 px-4">{row.precipitacion.toFixed(2)}</td>
                <td className="py-3 px-4">{row.intensidad.toFixed(2)}</td>
                <td className="py-3 px-4">{row.duracion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}