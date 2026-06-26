import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ImportDataProvider } from './context/ImportDataContext';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Login from './auth/Login';
import ImportarDatos from './pages/ImportarDatos';
import Calcular from './pages/Calcular';
import Analisis from './pages/Analisis';
import Historial from './pages/Historial';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Navbar onLogout={logout} />
          <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <Routes>
              <Route path="/" element={<ImportarDatos />} />
              <Route path="/calcular" element={<Calcular />} />
              <Route path="/analisis" element={<Analisis />} />
              <Route path="/historial" element={<Historial />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ImportDataProvider>
        <AppContent />
      </ImportDataProvider>
    </AuthProvider>
  );
}

export default App;
