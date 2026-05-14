import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Login from './auth/Login';
import ImportarDatos from './pages/ImportarDatos';
import Calcular from './pages/Calcular';
import Analisis from './pages/Analisis';
import HydroVisual from './components/HydroVisual';
import IDBChart from './components/IDFChart';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Navbar onLogout={handleLogout} />
          <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <Routes>
              <Route path="/" element={<ImportarDatos />} />
              <Route path="/calcular" element={<Calcular />} />
             <Route path="/analisis" element={<Analisis />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;