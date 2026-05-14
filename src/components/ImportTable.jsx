import { useImportData } from "../context/ImportDataContext";
import { useState, useEffect } from "react";

const ROWS_PER_PAGE = 10;

export default function ImportTable() {
  const { importedData, fileName } = useImportData();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [fileName]);

  if (!importedData || importedData.length === 0) return null;

  const headers = Object.keys(importedData[0]);
  const totalPages = Math.ceil(importedData.length / ROWS_PER_PAGE);
  const paginatedData = importedData.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  const start = (page - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(page * ROWS_PER_PAGE, importedData.length);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-12">
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              Tabla de Datos Importados
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Archivo:{" "}
              <span className="font-semibold text-gray-700">{fileName}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="px-8 pt-5 pb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {importedData.length} registros · {headers.length} columnas
        </span>
        <span className="text-xs text-gray-400">
          Mostrando {start}–{end} de {importedData.length}
        </span>
      </div>
      <div className="px-8 pb-6">
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {headers.map((key) => (
                  <th
                    key={key}
                    className="py-3 px-4 text-left text-sm font-semibold text-white bg-blue-600 whitespace-nowrap"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b last:border-b-0 border-gray-100 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
                >
                  {headers.map((key, i) => (
                    <td
                      key={i}
                      className="py-2.5 px-4 text-sm text-gray-700 whitespace-nowrap"
                    >
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <i className="fi fi-rr-angle-left text-xs"></i>
              Anterior
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => {
                const p = i + 1;
                if (
                  p === 1 ||
                  p === totalPages ||
                  (p >= page - 1 && p <= page + 1)
                ) {
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-blue-600 text-white border border-blue-600"
                          : "border border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  );
                }
                if (p === page - 2 || p === page + 2) {
                  return (
                    <span key={p} className="w-8 text-center text-gray-400 text-sm">
                      …
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Siguiente
              <i className="fi fi-rr-angle-right text-xs"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}