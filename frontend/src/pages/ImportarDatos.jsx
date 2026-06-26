import { useRef, useState } from "react";
import Papa from "papaparse";
import { useImportData } from "../context/ImportDataContext";
import api from "../api/client";

export default function ImportarDatos() {
  const fileInputRef = useRef(null);
  const { setImportedData, setFileName, setUploadId } = useImportData();
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  async function handleCsvChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setUploadStatus(null);

    // Parseo local para la tabla inmediata
    Papa.parse(file, {
      delimiter: ";",
      skipEmptyLines: true,
      complete: function (results) {
        const dataRows = results.data.filter(row =>
          /^[0-9]+$/.test((row[0] || "").trim())
        );
        const datosProcesados = dataRows.map(row => ({
          "N.º": row[0] || "",
          "Fecha": row[1] || "",
          "Contenido de agua (m³/m³)": row[2] || "",
          "Radiación solar (W/m²)": row[3] || "",
          "Temperatura (°C)": row[4] || "",
          "Humedad (%)": row[5] || "",
          "Viento (m/s)": row[6] || "",
          "Viento ráf. (m/s)": row[7] || "",
          "Dir. viento (°)": row[8] || "",
          "Precipitación (mm)": row[9] || ""
        }));
        setImportedData(datosProcesados);
      },
    });

    // Subida al backend
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/data/upload-csv", formData);
      setUploadId(data.id);
      setUploadStatus({ ok: true, message: `Subido: ${data.row_count} registros guardados` });
    } catch (err) {
      setUploadStatus({ ok: false, message: err.response?.data?.detail || "Error al subir el archivo" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="py-8 px-8 flex-1">
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
            <button
              className="w-full border-2 border-blue-500 text-blue-600 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition disabled:opacity-60"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              type="button"
            >
              <i className="fi fi-rr-file-upload"></i>
              {uploading ? "Subiendo..." : "Cargar archivo .CSV"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleCsvChange}
            />
          </div>

          {uploadStatus && (
            <div className={`rounded-lg px-4 py-3 text-sm font-medium mb-4 ${
              uploadStatus.ok
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {uploadStatus.message}
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">Formato CSV esperado:</h3>
            <code className="text-sm text-gray-700 block bg-white p-3 rounded border border-gray-200 font-mono">
              N.º;Fecha;Contenido de agua;Radiación;Temp;Humedad;Vel. viento;Vel. ráfaga;Dir. viento;Precipitación
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
              <h4 className="font-bold mb-3">Método Racional: Q = C × I × A</h4>
              <ul className="text-sm space-y-2">
                <li><strong>C</strong> — Coeficiente de escorrentía (0–1)</li>
                <li><strong>I</strong> — Intensidad de lluvia (mm/h)</li>
                <li><strong>A</strong> — Área de estudio (hectáreas)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
