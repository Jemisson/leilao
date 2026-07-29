import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../services/api";
import { toast } from "react-toastify";
import { FaCubes, FaCheckCircle, FaTimesCircle, FaUsers, FaMoneyBillWave, FaGavel } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StartCard";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";
import colors from "../styles/colors";

interface AuctionedProductsByDay {
  date: string;
  total?: number;
  count?: number;
  products_auctioned?: number;
}

interface DashboardStats {
  total_products: number;
  products_auctioned: number;
  products_not_auctioned: number;
  total_users: number;
  total_minimum_value: number;
  total_winning_value: number;
  auctioned_products_by_day?: AuctionedProductsByDay[];
}

function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const pieData = [
    {
      name: "Arrematados",
      value: stats?.products_auctioned ?? 0,
    },
    {
      name: "Não Arrematados",
      value: stats?.products_not_auctioned ?? 0,
    },
  ];
  
  const COLORS = [colors.gold, colors.redDark];
  const auctionedProductsByDay = (stats?.auctioned_products_by_day ?? []).map((item) => ({
    date: item.date,
    label: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(
      new Date(`${item.date}T00:00:00`)
    ),
    total: item.total ?? item.count ?? item.products_auctioned ?? 0,
  }));

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
    <div className="flex flex-col">
      <main className="flex-1">
        <PageHeader title="Dashboard" icon={<FaCubes className="h-5 w-5" />} />

        {!stats ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
            Carregando dados...
          </div>
        ) : (
          <div className="space-y-6">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total de Produtos"
                value={stats.total_products}
                icon={<FaCubes size={20} />}
                color="bg-white"
                compact
              />
              <StatCard
                title="Arrematados"
                value={stats.products_auctioned}
                icon={<FaCheckCircle size={20} />}
                color="bg-white"
                compact
              />
              <StatCard
                title="Não Arrematados"
                value={stats.products_not_auctioned}
                icon={<FaTimesCircle size={20} />}
                color="bg-white"
                compact
              />
              <StatCard
                title="Participantes"
                value={stats.total_users}
                icon={<FaUsers size={20} />}
                color="bg-white"
                compact
              />
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <StatCard
                title="Total (Mínimo)"
                value={stats.total_minimum_value}
                icon={<FaMoneyBillWave size={24} />}
                color="bg-white"
                isCurrency
              />
              <StatCard
                title="Total Arrematado"
                value={stats.total_winning_value}
                icon={<FaGavel size={24} />}
                color="bg-white"
                isCurrency
              />
            </section>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Produtos Arrematados por Dia</h2>
                    <p className="text-sm text-gray-500">Evolução diária dos lotes vendidos.</p>
                  </div>
                </div>

                <div className="h-80">
                  {auctionedProductsByDay.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={auctionedProductsByDay} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                        <Tooltip
                          labelFormatter={(label) => `Dia ${label}`}
                          formatter={(value) => [value, "Arrematados"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="total"
                          stroke={colors.redDark}
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm font-medium text-gray-500">
                      Dados diários ainda não disponíveis.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Distribuição de Produtos</h2>
                  <p className="text-sm text-gray-500">Comparativo entre lotes arrematados e disponíveis.</p>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="45%"
                        labelLine={false}
                        outerRadius={105}
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
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
