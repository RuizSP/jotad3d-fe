import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
import { ordersService } from "../../../services/orders.service";
import type { Order } from "../../../shared/interfaces/Order";
import { ORDER_STATUS_STEPS } from "../../../shared/interfaces/Order";
import StatusBadge from "../../../components/common/StatusBadge";
import ColorSwatch from "../../../components/common/ColorSwatch";

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const [searchInput, setSearchInput] = useState(initialCode);
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRequestId = useRef(0);

  const companyPhone = import.meta.env.VITE_COMPANY_WHATSAPP || "5511999999999";
  const cleanPhone = companyPhone.replace(/\D/g, "");

  const handleSearch = useCallback(async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    const requestId = ++searchRequestId.current;
    setLoading(true);
    setSearched(true);
    try {
      const found = await ordersService.getByCodeOrNumber(codeToSearch);
      if (requestId === searchRequestId.current) {
        setOrder(found);
      }
    } catch (error) {
      if (requestId === searchRequestId.current) {
        setOrder(null);
        console.error("Falha ao buscar pedido.", error);
      }
    } finally {
      if (requestId === searchRequestId.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (initialCode) {
      void handleSearch(initialCode);
    }
    return () => {
      searchRequestId.current += 1;
    };
  }, [initialCode, handleSearch]);

  const currentStepIndex = order
    ? ORDER_STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <Page.Root>
      <Page.Content>
        <Box sx={{ maxWidth: "md", mx: "auto", width: "100%", pb: 8 }}>
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              variant="h4"
              fontWeight="900"
              sx={{ letterSpacing: "-0.03em" }}
            >
              Acompanhar Produção 3D
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, maxWidth: 500, mx: "auto" }}
            >
              Insira o código de acompanhamento (ex: JD-XXXXX) ou o número do
              pedido para ver o status em tempo real.
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                mt: 3,
                maxWidth: 480,
                mx: "auto",
                borderRadius: "40px",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                gap: 1,
              }}
            >
              <TextField
                placeholder="Código (ex: JD-9A4B2) ou número"
                variant="standard"
                fullWidth
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(searchInput)
                }
                InputProps={{
                  disableUnderline: true,
                  sx: { px: 2, fontSize: "0.95rem" },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSearch(searchInput)}
                startIcon={
                  loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <Search size={18} />
                  )
                }
                sx={{ borderRadius: "40px", px: 3, fontWeight: 700 }}
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
              Nenhum pedido encontrado para o código informado. Verifique se
              digitou corretamente ou consulte o atendente no WhatsApp.
            </Alert>
          ) : order ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 4.5 },
                borderRadius: 4,
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
                <Box>
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

                <Box display="flex" alignItems="center" gap={1.5}>
                  <StatusBadge status={order.status} />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<MessageCircle size={16} />}
                    href={`https://wa.me/${cleanPhone}?text=Olá,%20gostaria%20de%20saber%20sobre%20meu%20pedido%20${order.accessCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ borderRadius: "30px", fontSize: "0.75rem" }}
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
                          gap: 2.5,
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
                    Destino da Entrega
                  </Typography>
                  <Box p={2} borderRadius={2} bgcolor="background.default">
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
