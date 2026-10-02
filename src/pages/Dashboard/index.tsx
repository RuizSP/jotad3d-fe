import { useState, useEffect, useMemo } from "react";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import { DollarSign, Layers, Clock, CheckCircle2, Home } from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { Page } from "../../components/ui/Page";
import { Elevation } from "../../components/ui/Elevation";
import { ordersService } from "../../services/orders.service";
import type { Order } from "../../shared/interfaces/Order";
import OrdersTable from "../../components/application/Orders/OrdersTable";
import { Filter } from "../../components/ui/Filter";

const STATUS_COLORS: Record<string, string> = {
  recebido: "#757575",
  confirmacao: "#FF9800",
  producao: "#1976D2",
  impressao_concluida: "#D4AF37",
  acabamento: "#9C27B0",
  pronto: "#2E7D32",
  finalizado: "#388E3C",
  cancelado: "#D32F2F",
};

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    ordersService.getAll().then((data) => setOrders(data));
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.paid)
      .reduce((acc, o) => acc + o.totalAmount, 0);

    const inProduction = orders.filter(
      (o) => o.status === "producao" || o.status === "acabamento" || o.status === "impressao_concluida"
    ).length;

    const completed = orders.filter(
      (o) => o.status === "pronto" || o.status === "finalizado"
    ).length;

    const totalPrintedUnits = orders.reduce(
      (acc, o) => acc + o.items.reduce((sum, it) => sum + it.quantity, 0),
      0
    );

    const statusCounts: Record<string, number> = {};
    orders.forEach((o) => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });

    const chartData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.replace("_", " "),
      value: count,
      fill: STATUS_COLORS[status] || "#D4AF37",
    }));

    return {
      totalRevenue,
      inProduction,
      completed,
      totalPrintedUnits,
      chartData,
    };
  }, [orders]);

  return (
    <Page.Root>
      <Page.Header>
        <Page.Title
          icon={Home}
          links={[{ title: "Painel JOTAD3D", path: "/admin/dashboard" }]}
        />
      </Page.Header>

      <Page.Content>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "1fr 1fr 1fr 1fr",
            },
            gap: 2.5,
            mb: 4,
          }}
        >
          <Elevation.Root>
            <Elevation.Container icon={DollarSign}>
              <Elevation.Title title={"Faturamento Recebido"} />
              <Elevation.Content>
                <Typography fontSize={24} fontWeight="900" color="secondary.main">
                  R$ {stats.totalRevenue.toFixed(2)}
                </Typography>
              </Elevation.Content>
            </Elevation.Container>
          </Elevation.Root>

          <Elevation.Root>
            <Elevation.Container icon={Clock}>
              <Elevation.Title title={"Em Produção"} />
              <Elevation.Content>
                <Typography fontSize={24} fontWeight="900">
                  {stats.inProduction} {stats.inProduction === 1 ? "pedido" : "pedidos"}
                </Typography>
              </Elevation.Content>
            </Elevation.Container>
          </Elevation.Root>

          <Elevation.Root>
            <Elevation.Container icon={CheckCircle2}>
              <Elevation.Title title={"Prontos / Concluídos"} />
              <Elevation.Content>
                <Typography fontSize={24} fontWeight="900" color="success.main">
                  {stats.completed} {stats.completed === 1 ? "pedido" : "pedidos"}
                </Typography>
              </Elevation.Content>
            </Elevation.Container>
          </Elevation.Root>

          <Elevation.Root>
            <Elevation.Container icon={Layers}>
              <Elevation.Title title={"Total de Peças"} />
              <Elevation.Content>
                <Typography fontSize={24} fontWeight="900">
                  {stats.totalPrintedUnits} unidades
                </Typography>
              </Elevation.Content>
            </Elevation.Container>
          </Elevation.Root>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", p: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="800" gutterBottom>
                  Distribuição de Fila por Status
                </Typography>
                <Box height={260}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.chartData}>
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis allowDecimals={false} fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {stats.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", p: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="800" gutterBottom>
                  Proporção de Pedidos
                </Typography>
                <Box height={260} display="flex" alignItems="center" justifyContent="center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {stats.chartData.map((entry, index) => (
                          <Cell key={`cell-pie-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Filter.Provider initialFormValues={{}}>
            <OrdersTable />
          </Filter.Provider>
        </Box>
      </Page.Content>
    </Page.Root>
  );
}
