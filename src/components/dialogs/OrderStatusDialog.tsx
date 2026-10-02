import { useState } from "react";
import {
  MenuItem,
  TextField,
  Stack,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import type { DialogProps } from "@toolpad/core";
import { Dialog } from "../ui/Dialog";
import {
  ORDER_STATUS_STEPS,
  type Order,
  type OrderStatus,
} from "../../shared/interfaces/Order";
import { useUpdateOrderStatus } from "../../hooks/useOrders";
import StatusBadge from "../common/StatusBadge";

export default function OrderStatusDialog({
  open,
  onClose,
  payload,
}: DialogProps<Order, boolean>) {
  const [status, setStatus] = useState<OrderStatus>(
    payload?.status || "recebido",
  );
  const [paid, setPaid] = useState<boolean>(payload?.paid || false);
  const [cancellationReason, setCancellationReason] = useState<string>(
    payload?.notes || "",
  );
  const updateOrderStatus = useUpdateOrderStatus();
  const loading = updateOrderStatus.isPending;

  if (!payload) return null;

  const handleSubmit = async () => {
    try {
      const updated = await updateOrderStatus.mutateAsync({
        id: payload.id,
        status,
        paid,
        notes: cancellationReason,
      });
      if (updated) await onClose(true);
    } catch {
      return;
    }
  };

  return (
    <Dialog.Root open={open} onClose={() => onClose(false)} maxWidth="xs">
      <Dialog.Header>
        <Dialog.Title title={`Status do Pedido #${payload.orderNumber}`} />
        <Dialog.ActionClose onClose={async () => onClose(false)} />
      </Dialog.Header>

      <Dialog.Content>
        <Stack spacing={2.5}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              textTransform="uppercase"
              fontWeight="700"
            >
              Cliente
            </Typography>
            <Typography variant="body1" fontWeight="800">
              {payload.customerName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Código: {payload.accessCode} • Total: R${" "}
              {payload.totalAmount.toFixed(2)}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="caption" color="text.secondary">
              Status Atual:
            </Typography>
            <StatusBadge status={payload.status} />
          </Box>

          <Divider />

          <TextField
            select
            label="Novo Status de Produção"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            fullWidth
          >
            {ORDER_STATUS_STEPS.map((s) => (
              <MenuItem key={s.key} value={s.key}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>

          {status === "cancelado" && (
            <TextField
              label="Motivo do Cancelamento"
              placeholder="Ex: Falta de filamento na cor, desistência, etc."
              multiline
              rows={2}
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              fullWidth
            />
          )}

          <FormControlLabel
            control={
              <Switch
                checked={paid}
                onChange={(e) => setPaid(e.target.checked)}
                color="success"
              />
            }
            label={paid ? "Pedido Pago (Confirmado)" : "Pagamento Pendente"}
          />
        </Stack>
      </Dialog.Content>

      <Dialog.Footer>
        <Dialog.FooterActions>
          <Dialog.ActionCancel onClick={() => onClose(false)}>
            Cancelar
          </Dialog.ActionCancel>
          <Dialog.ActionSubmit onClick={handleSubmit} loading={loading}>
            Salvar Alterações
          </Dialog.ActionSubmit>
        </Dialog.FooterActions>
      </Dialog.Footer>
    </Dialog.Root>
  );
}
