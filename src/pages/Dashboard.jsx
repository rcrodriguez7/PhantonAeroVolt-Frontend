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
      try {
        const response = await axios.get("https://phanton-aerovolt-backend.onrender.com/metrics", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("📊 Datos recibidos de la API:", response.data); // Verifica la respuesta en consola

        setMetrics(response.data);
      } catch (err) {
        console.error("❌ Error al cargar métricas:", err);
        setError(err.message || "Error al cargar métricas");
      }
    };

    fetchMetrics();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!metrics) return <div className="text-gray-500 text-center mt-10">Cargando métricas...</div>;

  // Validaciones de datos para evitar errores
  const barData = [
    { name: "Últimos 7 días", users: metrics.newUsersLastWeek || 0 },
    { name: "Usuarios Activos", users: metrics.activeUsers || 0 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const pieData = (metrics.roleDistribution || []).map((role, index) => ({
    name: role._id || "Desconocido",
    value: role.count || 0,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard - Phanton AeroVolt</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total de Usuarios</h2>
          <p className="text-3xl font-bold text-indigo-600">{metrics.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total de Bids</h2>
          <p className="text-3xl font-bold text-indigo-600">{metrics.totalBids || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total de Proposals</h2>
          <p className="text-3xl font-bold text-indigo-600">{metrics.totalProposals || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Usuarios Registrados vs Activos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Distribución de Roles</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
