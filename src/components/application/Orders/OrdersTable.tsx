import { useMemo, useCallback } from "react";
import { usePagination } from "../../../hooks/usePagination";
import { DataTable } from "../../ui/DataTable";
import { Filter } from "../../ui/Filter";
import type { GridColDef } from "@mui/x-data-grid";
import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import { MessageSquareShare, Edit, Eye } from "lucide-react";
import { useDialogs } from "@toolpad/core";
import { useOrders } from "../../../hooks/useOrders";
import type { Order } from "../../../shared/interfaces/Order";
import StatusBadge from "../../common/StatusBadge";
import OrderStatusDialog from "../../dialogs/OrderStatusDialog";
import OrderDetailsDialog from "../../dialogs/OrderDetailsDialog";

export default function OrdersTable() {
  const { data: orders = [], isPending: loading } = useOrders();
  const dialogs = useDialogs();

  const { page, perPage, handleChangePage, handleChangeRowsPerPage } =
    usePagination();

  const handleEditStatus = useCallback(
    async (order: Order) => {
      await dialogs.open(OrderStatusDialog, order);
    },
    [dialogs],
  );

  const handleViewDetails = useCallback(
    async (order: Order) => {
      await dialogs.open(OrderDetailsDialog, order);
    },
    [dialogs],
  );

  const columns = useMemo(
    (): GridColDef<Order>[] => [
      {
        field: "accessCode",
        headerName: "Código / Nº",
        flex: 0.9,
        renderCell: (params) => (
          <Box display="flex" flexDirection="column" justifyContent="center">
            <Typography variant="body2" fontWeight="800">
              {params.row.accessCode}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              #{params.row.orderNumber}
            </Typography>
          </Box>
        ),
      },
      {
        field: "customerName",
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
        headerName: "Contato",
        flex: 1,
        renderCell: (params) => {
          const phone = params.row.whatsapp;
          if (!phone) return <Typography variant="caption">-</Typography>;
          const clean = phone.replace(/\D/g, "");
          return (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="caption">{phone}</Typography>
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
        field: "recebimento",
        headerName: "Recebimento",
        flex: 0.9,
        valueGetter: (_, row) =>
          row.deliveryMethod === "pickup"
            ? "Retirada na loja"
            : row.address?.cidade || "-",
      },
      {
        field: "items",
        headerName: "Peças",
        flex: 0.7,
        renderCell: (params) => {
          const totalUnits = params.row.items.reduce(
            (acc, it) => acc + it.quantity,
            0,
          );
          return (
            <Typography variant="body2">
              {totalUnits} {totalUnits === 1 ? "peça" : "peças"}
            </Typography>
          );
        },
      },
      {
        field: "totalAmount",
        headerName: "Total",
        flex: 0.8,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight="800" color="secondary.main">
            R$ {params.row.totalAmount.toFixed(2)}
          </Typography>
        ),
      },
      {
        field: "status",
        headerName: "Status Produção",
        flex: 1.1,
        renderCell: (params) => <StatusBadge status={params.row.status} />,
      },
      {
        field: "paid",
        headerName: "Pagamento",
        flex: 0.8,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.row.paid ? "Pago" : "Pendente"}
            color={params.row.paid ? "success" : "warning"}
            sx={{ fontWeight: 700, fontSize: "0.7rem" }}
          />
        ),
      },
      {
        field: "id",
        headerName: "Ações",
        type: "actions",
        flex: 0.8,
        renderCell: (params) => (
          <Box display="flex" gap={0.5}>
            <Tooltip title="Ver Detalhes">
              <IconButton
                size="small"
                onClick={() => handleViewDetails(params.row)}
              >
                <Eye size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Atualizar Status">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleEditStatus(params.row)}
              >
                <Edit size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [handleEditStatus, handleViewDetails],
  );

  return (
    <DataTable.Root>
      <DataTable.Toolbar>
        <DataTable.Title>Gestão de Pedidos 3D</DataTable.Title>
        <Filter.Container>
          <Filter.Header>
            <Filter.SearchBar />
          </Filter.Header>
        </Filter.Container>
      </DataTable.Toolbar>
      <DataTable.Table columns={columns} data={orders} loading={loading} />
      <DataTable.Footer>
        <DataTable.Pagination
          count={orders.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          perPage={perPage}
        />
      </DataTable.Footer>
    </DataTable.Root>
  );
}
