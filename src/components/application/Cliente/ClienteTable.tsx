import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { MessageSquareShare } from "lucide-react";
import { DataTable } from "../../ui/DataTable";
import { Filter } from "../../ui/Filter";
import { usePagination } from "../../../hooks/usePagination";
import { useOrders } from "../../../hooks/useOrders";

interface CustomerRecord {
  id: string;
  name: string;
  whatsapp: string;
  cidade: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export default function ClienteTable() {
  const { data: orders = [], isPending: loading } = useOrders();

  const { page, perPage, handleChangePage, handleChangeRowsPerPage } =
    usePagination();

  const customers = useMemo(() => {
    const map = new Map<string, CustomerRecord>();

    orders.forEach((order) => {
      const key = order.whatsapp || order.customerName;
      const existing = map.get(key);

      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += order.totalAmount;
        if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.createdAt;
        }
      } else {
        map.set(key, {
          id: order.id,
          name: order.customerName,
          whatsapp: order.whatsapp,
          cidade: order.address?.cidade || "-",
          orderCount: 1,
          totalSpent: order.totalAmount,
          lastOrderDate: order.createdAt,
        });
      }
    });

    return Array.from(map.values());
  }, [orders]);

  const columns = useMemo(
    (): GridColDef<CustomerRecord>[] => [
      {
        field: "name",
        headerName: "Cliente",
        flex: 1.2,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight="700">
            {params.value}
          </Typography>
        ),
      },
      {
        field: "whatsapp",
        headerName: "WhatsApp",
        flex: 1.1,
        renderCell: (params) => {
          const phone = params.row.whatsapp;
          if (!phone) return <Typography variant="caption">-</Typography>;
          const clean = phone.replace(/\D/g, "");
          return (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">{phone}</Typography>
              <Tooltip title="Conversar no WhatsApp">
                <IconButton
                  size="small"
                  href={`https://wa.me/${clean}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "#25D366" }}
                >
                  <MessageSquareShare size={16} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
      {
        field: "cidade",
        headerName: "Cidade",
        flex: 1,
      },
      {
        field: "orderCount",
        headerName: "Nº de Pedidos",
        flex: 0.8,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight="600">
            {params.value} {params.value === 1 ? "pedido" : "pedidos"}
          </Typography>
        ),
      },
      {
        field: "totalSpent",
        headerName: "Total em Peças 3D",
        flex: 1,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight="800" color="secondary.main">
            R$ {params.row.totalSpent.toFixed(2)}
          </Typography>
        ),
      },
      {
        field: "lastOrderDate",
        headerName: "Último Pedido",
        flex: 1,
        renderCell: (params) => (
          <Typography variant="caption" color="text.secondary">
            {new Date(params.value).toLocaleDateString("pt-BR")}
          </Typography>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable.Root>
      <DataTable.Toolbar>
        <DataTable.Title>Histórico de Clientes (WhatsApp)</DataTable.Title>
        <Filter.Container>
          <Filter.Header>
            <Filter.SearchBar />
          </Filter.Header>
        </Filter.Container>
      </DataTable.Toolbar>
      <DataTable.Table columns={columns} data={customers} loading={loading} />
      <DataTable.Footer>
        <DataTable.Pagination
          count={customers.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          perPage={perPage}
        />
      </DataTable.Footer>
    </DataTable.Root>
  );
}
