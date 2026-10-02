import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Divider,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { Page } from "../../../components/ui/Page";
import { useOrderByAccessCode } from "../../../hooks/useOrders";
import { ORDER_STATUS_STEPS } from "../../../shared/interfaces/Order";
import StatusBadge from "../../../components/common/StatusBadge";
import ColorSwatch from "../../../components/common/ColorSwatch";
import { useOrderTracking } from "../../../providers/OrderTrackingProvider";
import StoreLocationAddress from "../../../components/common/StoreLocationAddress";

export default function OrderTracking() {
  const { trackingCode, setTrackingCode } = useOrderTracking();
  const [searchState, setSearchState] = useState(() => ({
    input: trackingCode,
    query: trackingCode,
  }));
  const currentSearch = searchState;
  const { input: searchInput, query: searchCode } = currentSearch;
  const {
    data: order = null,
    error,
    isFetched,
    isFetching: loading,
    refetch,
  } = useOrderByAccessCode(searchCode);
  const searched = Boolean(searchCode) && isFetched;

  const companyPhone = import.meta.env.VITE_COMPANY_WHATSAPP || "5511999999999";
  const cleanPhone = companyPhone.replace(/\D/g, "");

  const handleSearch = () => {
    const code = currentSearch.input.trim();
    if (!code) return;
    setTrackingCode(code);

    if (code.toUpperCase() === currentSearch.query.trim().toUpperCase()) {
      void refetch();
    } else {
      setSearchState({ input: code, query: code });
    }
  };

  const currentStepIndex = order
    ? ORDER_STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <Page.Root>
      <Page.Content>
        <Box
          sx={{ maxWidth: "md", mx: "auto", width: "100%", minWidth: 0, pb: 8 }}
        >
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              variant="h4"
              fontWeight="900"
              sx={{
                fontSize: { xs: "1.7rem", sm: "2.125rem" },
                lineHeight: 1.15,
                overflowWrap: "anywhere",
              }}
            >
              Acompanhar Produção 3D
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, maxWidth: 500, mx: "auto" }}
            >
              Insira o código de acompanhamento (ex: JD-AB12CD34EF56) para
              consultar o status do pedido.
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 1, sm: 1.5 },
                mt: 3,
                maxWidth: 480,
                mx: "auto",
                borderRadius: "40px",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                gap: 1,
                minWidth: 0,
              }}
            >
              <TextField
                placeholder="Código de acompanhamento"
                variant="standard"
                fullWidth
                sx={{ minWidth: 0, flex: 1 }}
                value={searchInput}
                onChange={(e) =>
                  setSearchState({ ...currentSearch, input: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    px: { xs: 1, sm: 2 },
                    fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                startIcon={
                  loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <Search size={18} />
                  )
                }
                sx={{
                  borderRadius: "40px",
                  px: { xs: 1.5, sm: 3 },
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                Buscar
              </Button>
            </Paper>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress color="secondary" />
            </Box>
          ) : searched && !order ? (
            <Alert
              severity="warning"
              sx={{ borderRadius: 3, maxWidth: 540, mx: "auto" }}
            >
              {error
                ? "Não foi possível consultar o pedido. Tente novamente."
                : "Nenhum pedido encontrado para o código informado. Verifique se digitou corretamente ou consulte o atendente no WhatsApp."}
            </Alert>
          ) : order ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2.5, md: 4.5 },
                borderRadius: { xs: 2, sm: 4 },
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={2}
                mb={4}
              >
                <Box minWidth={0}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    textTransform="uppercase"
                    fontWeight="700"
                  >
                    Código de Rastreio: <strong>{order.accessCode}</strong>
                  </Typography>
                  <Typography variant="h5" fontWeight="900" sx={{ mt: 0.5 }}>
                    Pedido #{order.orderNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cliente: {order.customerName}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <StatusBadge status={order.status} />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<MessageCircle size={16} />}
                    href={`https://wa.me/${cleanPhone}?text=Olá,%20gostaria%20de%20saber%20sobre%20meu%20pedido%20${order.accessCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      borderRadius: "30px",
                      fontSize: "0.75rem",
                      maxWidth: "100%",
                    }}
                  >
                    Suporte WhatsApp
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 3 }}>
                Linha do Tempo da Produção
              </Typography>

              <Stack spacing={2} sx={{ mb: 5 }}>
                {ORDER_STATUS_STEPS.filter((s) => s.key !== "cancelado").map(
                  (step, idx) => {
                    const isDone = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <Box
                        key={step.key}
                        sx={{
                          display: "flex",
                          gap: { xs: 1.5, sm: 2.5 },
                          alignItems: "flex-start",
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            bgcolor: isCurrent
                              ? "secondary.main"
                              : isDone
                                ? "primary.main"
                                : "background.default",
                            color: isCurrent
                              ? "#0A0A0A"
                              : isDone
                                ? "#FFFFFF"
                                : "text.disabled",
                            border: "2px solid",
                            borderColor: isCurrent
                              ? "secondary.main"
                              : isDone
                                ? "primary.main"
                                : "divider",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontWeight: 800,
                            fontSize: "0.85rem",
                            zIndex: 1,
                          }}
                        >
                          {isDone ? (
                            <CheckCircle size={18} />
                          ) : (
                            <Clock size={16} />
                          )}
                        </Box>

                        <Box sx={{ flexGrow: 1, pt: 0.5 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={isCurrent ? 900 : isDone ? 700 : 500}
                            color={
                              isCurrent
                                ? "secondary.main"
                                : isDone
                                  ? "text.primary"
                                  : "text.secondary"
                            }
                          >
                            {step.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {step.description}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  },
                )}
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" fontWeight="800" gutterBottom>
                    Itens da Encomenda
                  </Typography>
                  <Stack spacing={1.5}>
                    {order.items.map((item, idx) => (
                      <Box
                        key={idx}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        p={1.5}
                        borderRadius={2}
                        bgcolor="background.default"
                      >
                        <Box>
                          <Typography variant="body2" fontWeight="700">
                            {item.quantity}x {item.productName}
                          </Typography>
                          {item.color && (
                            <Box display="flex" alignItems="center" gap={0.8}>
                              <ColorSwatch colorName={item.color} size={10} />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.color}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Typography variant="body2" fontWeight="800">
                          R$ {(item.unitPrice * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" fontWeight="800" gutterBottom>
                    {order.deliveryMethod === "pickup"
                      ? "Retirada na loja"
                      : "Destino da Entrega"}
                  </Typography>
                  <Box p={2} borderRadius={2} bgcolor="background.default">
                    {order.deliveryMethod === "pickup" ? (
                      order.storeLocation ? (
                        <StoreLocationAddress location={order.storeLocation} />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          O local e o horário da retirada serão combinados pelo
                          WhatsApp.
                        </Typography>
                      )
                    ) : order.address ? (
                      <>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <MapPin size={16} />
                          <Typography variant="body2" fontWeight="700">
                            {order.address.cidade}
                          </Typography>
                        </Box>
                        {order.address.rua && (
                          <Typography variant="body2" color="text.secondary">
                            {order.address.rua}, {order.address.numero}
                            {order.address.complemento
                              ? ` (${order.address.complemento})`
                              : ""}
                            <br />
                            {order.address.bairro} • CEP {order.address.cep}
                          </Typography>
                        )}
                      </>
                    ) : null}
                    <Divider sx={{ my: 1.5 }} />
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle2" fontWeight="800">
                        Total do Pedido:
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="900"
                        color="secondary.main"
                      >
                        R$ {order.totalAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ) : null}
        </Box>
      </Page.Content>
    </Page.Root>
  );
}
