import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Obtener la URL del backend desde las variables de entorno
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Cargar métricas del backend al montar el componente
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${API_URL}/metrics`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMetrics(response.data);
      } catch (err) {
        setError(err.message || 'Error al cargar métricas');
      }
    };

    fetchMetrics();
  }, [API_URL]);

  // Manejar el logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mostrar mensaje de error o estado de carga
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!metrics) return <div className="text-gray-500 text-center mt-10">Cargando métricas...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard - Phanton AeroVolt</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Sección de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta: Total de Usuarios */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total de Usuarios</h2>
          <p className="text-3xl font-bold text-indigo-600">{metrics.totalUsers}</p>
        </div>

        {/* Tarjeta: Total de Bids */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total de Bids</h2>
          <p className="text-3xl font-bold text-indigo-600">{metrics.totalBids}</p>
        </div>

        {/* Tarjeta: Total de Proposals */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total de Proposals</h2>
          <p className="text-3xl font-bold text-indigo-600">{metrics.totalProposals}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;