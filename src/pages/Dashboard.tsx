import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../services/api";
import { toast } from "react-toastify";
import { FaCubes, FaCheckCircle, FaTimesCircle, FaUsers, FaMoneyBillWave, FaGavel } from "react-icons/fa";
import StatCard from "../components/StartCard";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import colors from "../styles/colors";


function DashboardPage() {
  const [stats, setStats] = useState<{
    total_products: number;
    products_auctioned: number;
    products_not_auctioned: number;
    total_users: number;
    total_minimum_value: number;
    total_winning_value: number;
  } | null>(null);

  const pieData = [
    {
      name: "Arrematados",
      value: stats?.products_auctioned,
    },
    {
      name: "Não Arrematados",
      value: stats?.products_not_auctioned,
    },
  ];
  
  const COLORS = [colors.gold, colors.redDark]; // verde e amarelo

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        toast.error(`Erro ao carregar dados do dashboard: ${err}`);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="flex">
      <div className="flex-1 transition-all p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Bem-vindo(a) ao Dashboard</h1>

        {!stats ? (
          <p>Carregando dados...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total de Produtos"
              value={stats.total_products}
              icon={<FaCubes size={28} />}
              color="bg-gray-100"
            />
            <StatCard
              title="Não Arrematados"
              value={stats.products_not_auctioned}
              icon={<FaTimesCircle size={28} />}
              color="bg-gray-100"
            />
            <StatCard
              title="Arrematados"
              value={stats.products_auctioned}
              icon={<FaCheckCircle size={28} />}
              color="bg-gray-100"
            />
            <StatCard
              title="Participantes"
              value={stats.total_users}
              icon={<FaUsers size={28} />}
              color="bg-gray-100"
            />
            <StatCard
              title="Total (Mínimo)"
              value={stats.total_minimum_value}
              icon={<FaMoneyBillWave size={28} />}
              color="bg-gray-100"
              isCurrency
            />
            <StatCard
              title="Total Arrematado"
              value={stats.total_winning_value}
              icon={<FaGavel size={28} />}
              color="bg-gray-100"
              isCurrency
            />
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-20 text-center">Distribuição de Produtos</h2>
        <div className="h-72 w-full flex justify-center">
          <div className="w-full md:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
