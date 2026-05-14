import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onLogout }) {
  const [activeTab, setActiveTab] = useState('importar');
  const navigate = useNavigate();

  const navItems = [
    { id: 'importar', label: 'Importar Datos', iconClass: 'fi fi-rr-file-import', path: '/' },
    { id: 'calcular', label: 'Calcular Escorrentía', iconClass: 'fi fi-rr-water', path: '/calcular' },
    { id: 'analisis', label: 'Análisis Visual', icon: 'droplet', path: '/analisis' },
  ];

  const DropletIcon = () => (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.32 0z" />
    </svg>
  );

  const handleNavigation = (id, path) => {
    setActiveTab(id);
    navigate(path);
  };

  return (
    <aside className="bg-white border-r border-gray-200 w-72 px-6 py-8 flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id, item.path)}
            className={`
              px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-3 transition-all duration-300 justify-start w-full
              ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-md'
                  : 'bg-transparent text-gray-700 hover:text-gray-900'
              }
            `}
          >
            {item.icon === 'droplet' ? (
              <DropletIcon />
            ) : (
              <i className={`${item.iconClass} text-lg flex-shrink-0`}></i>
            )}
            <span className="text-left line-clamp-2">{item.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onLogout}
        className="w-full px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-200"
      >
        <i className="fi fi-rr-sign-out-alt text-lg"></i>
        Cerrar sesión
      </button>
    </aside>
  );
}