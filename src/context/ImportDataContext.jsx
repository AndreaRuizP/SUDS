import { createContext, useContext, useState } from "react";

const ImportDataContext = createContext();

export function useImportData() {
  return useContext(ImportDataContext);
}

export function ImportDataProvider({ children }) {
  const [importedData, setImportedData] = useState([]);
  const [fileName, setFileName] = useState("");

  return (
    <ImportDataContext.Provider value={{ importedData, setImportedData, fileName, setFileName }}>
      {children}
    </ImportDataContext.Provider>
  );
}