import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        navigate("/");
        return;
      }

      try {
        const response = await axios.get("https://phanton-aerovolt-backend.onrender.com/metrics", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📊 Datos recibidos de la API:", response.data);
        setMetrics(response.data);
      } catch (err) {
        console.error("❌ Error al cargar métricas:", err);
        setError(err.response?.status === 401 ? "Session expired. Please log in again." : err.message || "Error al cargar métricas");
        if (err.response?.status === 401) navigate("/");
      }
    };

    fetchMetrics();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!metrics) return <div className="text-gray-500 text-center mt-10">Cargando métricas...</div>;

  // Preparar datos para gráficos basados en lo que el backend devuelve
  const barData = [
    { name: "Total Bids", value: metrics.totalBids || 0 },
    { name: "Upcoming Bids (3 días)", value: metrics.upcomingBids?.length || 0 },
  ];

  const pieData = (metrics.bidsByStatus || []).map((status, index) => ({
    name: status.status || "Desconocido",
    value: status._count.id || 0,
    fill: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4],
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Dashboard - Phanton AeroVolt</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Total de Bids</h2>
          <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{metrics.totalBids || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Bids Próximos (3 días)</h2>
          <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{metrics.upcomingBids?.length || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Estado de Bids</h2>
          <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{(metrics.bidsByStatus || []).reduce((sum, status) => sum + (status._count.id || 0), 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 sm:mt-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Bids por Estado</h2>
          <ResponsiveContainer width="100%" height={250} className="sm:h-300">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Distribución por Estado</h2>
          <ResponsiveContainer width="100%" height={250} className="sm:h-300">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;