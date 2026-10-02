import { Box, Typography, Stack, Divider, Button, Chip } from "@mui/material";
import { MapPin, MessageSquareShare } from "lucide-react";
import type { DialogProps } from "@toolpad/core";
import { Dialog } from "../ui/Dialog";
import type { Order } from "../../shared/interfaces/Order";
import StatusBadge from "../common/StatusBadge";
import ColorSwatch from "../common/ColorSwatch";

export default function OrderDetailsDialog({
  open,
  onClose,
  payload,
}: DialogProps<Order, void>) {
  if (!payload) return null;

  const cleanPhone = payload.whatsapp.replace(/\D/g, "");

  return (
    <Dialog.Root open={open} onClose={() => onClose()} maxWidth="sm">
      <Dialog.Header>
        <Dialog.Title title={`Detalhes da Encomenda #${payload.orderNumber}`} />
        <Dialog.ActionClose onClose={async () => onClose()} />
      </Dialog.Header>

      <Dialog.Content>
        <Stack spacing={2.5}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Typography variant="h6" fontWeight="900">
                {payload.customerName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Código: <strong>{payload.accessCode}</strong> •{" "}
                {new Date(payload.createdAt).toLocaleDateString("pt-BR")}
              </Typography>
            </Box>
            <StatusBadge status={payload.status} />
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={payload.paid ? "PAGO" : "PAGAMENTO PENDENTE"}
              size="small"
              color={payload.paid ? "success" : "warning"}
              sx={{ fontWeight: 800, fontSize: "0.7rem" }}
            />
            {payload.whatsapp && (
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                startIcon={<MessageSquareShare size={14} />}
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ borderRadius: "20px", fontSize: "0.75rem", py: 0.2 }}
              >
                Abrir WhatsApp ({payload.whatsapp})
              </Button>
            )}
          </Box>

          <Divider />

          <Typography
            variant="subtitle2"
            fontWeight="800"
            textTransform="uppercase"
          >
            Itens Solicitados
          </Typography>

          <Stack spacing={1.5}>
            {payload.items.map((item, idx) => (
              <Box
                key={idx}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={1.5}
                borderRadius={2}
                bgcolor="background.default"
                border="1px solid"
                borderColor="divider"
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  {item.imageUrl && (
                    <Box
                      component="img"
                      src={item.imageUrl}
                      alt={item.productName}
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 1.5,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <Box>
                    <Typography variant="body2" fontWeight="700">
                      {item.quantity}x {item.productName}
                    </Typography>
                    {item.color && (
                      <Box display="flex" alignItems="center" gap={0.8}>
                        <ColorSwatch colorName={item.color} size={10} />
                        <Typography variant="caption" color="text.secondary">
                          {item.color}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Typography variant="body2" fontWeight="800">
                  R$ {(item.unitPrice * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={1}
          >
            <Typography variant="subtitle1" fontWeight="800">
              Valor Total:
            </Typography>
            <Typography variant="h6" fontWeight="900" color="secondary.main">
              R$ {payload.totalAmount.toFixed(2)}
            </Typography>
          </Box>

          <Divider />

          <Typography
            variant="subtitle2"
            fontWeight="800"
            textTransform="uppercase"
          >
            {payload.deliveryMethod === "pickup"
              ? "Retirada na loja"
              : "Endereço de Entrega"}
          </Typography>

          <Box
            p={2}
            borderRadius={2}
            bgcolor="background.default"
            border="1px solid"
            borderColor="divider"
          >
            {payload.deliveryMethod === "pickup" ? (
              <Typography variant="body2" color="text.secondary">
                O local e o horário da retirada serão combinados pelo WhatsApp.
              </Typography>
            ) : payload.address ? (
              <>
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <MapPin size={16} />
                  <Typography variant="body2" fontWeight="700">
                    {payload.address.cidade}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {payload.address.rua}, {payload.address.numero}
                  {payload.address.complemento
                    ? ` (${payload.address.complemento})`
                    : ""}
                  <br />
                  {payload.address.bairro} • CEP {payload.address.cep}
                </Typography>
              </>
            ) : null}
            {payload.notes && (
              <Box mt={1.5} pt={1} borderTop="1px dashed" borderColor="divider">
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="700"
                >
                  Observações:
                </Typography>
                <Typography variant="body2">{payload.notes}</Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </Dialog.Content>

      <Dialog.Footer>
        <Dialog.FooterActions>
          <Button
            variant="outlined"
            onClick={() => onClose()}
            sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}
          >
            Fechar
          </Button>
        </Dialog.FooterActions>
      </Dialog.Footer>
    </Dialog.Root>
  );
}
