function toCsvValue(value) {
  const str = value === null || value === undefined ? "" : String(value);
  return /[";\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function exportToCsv(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(";"),
    ...rows.map((row) => headers.map((h) => toCsvValue(row[h])).join(";")),
  ];
  // BOM para que Excel detecte UTF-8 correctamente
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportCalculosToCsv(calculos, filename = "historial_calculos.csv") {
  const rows = calculos.map((c) => ({
    ID: c.id,
    Fecha: new Date(c.fecha).toLocaleString("es-CO"),
    "Coeficiente C": c.coeficiente_c,
    "Intensidad (mm/h)": c.intensidad,
    "Area (ha)": c.area,
    "Duracion (min)": c.duracion,
    "Periodo de Retorno": c.periodo_retorno,
    "Tipo de Superficie": c.tipo_superficie,
    "Caudal Maximo (m3/s)": c.caudal_maximo,
  }));
  exportToCsv(rows, filename);
}
