import { useRef, useState } from "react";
import * as Yup from "yup";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  TextField,
  Grid,
  Stack,
  Divider,
  Alert,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle2,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  MessageSquareShare,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../providers/CartContext";
import { Page } from "../../../components/ui/Page";
import { useForm } from "../../../hooks/useForm";
import { ordersService } from "../../../services/orders.service";
import { useCreateOrder } from "../../../hooks/useOrders";
import { cepService } from "../../../services/cep.service";
import type { Order } from "../../../shared/interfaces/Order";
import ColorSwatch from "../../../components/common/ColorSwatch";

interface CheckoutFormData {
  customerName: string;
  whatsapp: string;
  email: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  complemento: string;
  notes: string;
}

const checkoutValidationSchema = Yup.object().shape({
  customerName: Yup.string()
    .required("Informe seu nome completo")
    .min(3, "Mínimo 3 caracteres"),
  whatsapp: Yup.string()
    .required("Informe seu WhatsApp")
    .min(8, "Telefone inválido"),
  email: Yup.string().email("E-mail inválido"),
  cep: Yup.string().required("Informe o CEP").min(8, "CEP inválido"),
  rua: Yup.string().required("Informe a rua/endereço"),
  numero: Yup.string().required("Informe o número"),
  bairro: Yup.string().required("Informe o bairro"),
  cidade: Yup.string().required("Informe a cidade"),
  complemento: Yup.string(),
  notes: Yup.string(),
});

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const createOrder = useCreateOrder();
  const isSubmitting = createOrder.isPending;
  const submissionInProgress = useRef(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();

  const companyPhone = import.meta.env.VITE_COMPANY_WHATSAPP || "5511999999999";

  const handleCepChange = async (val: string) => {
    changeValue("cep", val);
    const clean = val.replace(/\D/g, "");
    if (clean.length === 8) {
      setIsSearchingCep(true);
      try {
        const res = await cepService.lookup(clean);
        if (res && !res.erro) {
          if (res.logradouro) changeValue("rua", res.logradouro);
          if (res.bairro) changeValue("bairro", res.bairro);
          if (res.localidade) changeValue("cidade", res.localidade);
        }
      } finally {
        setIsSearchingCep(false);
      }
    }
  };

  const { data, changeValue, validation, validationErrors } =
    useForm<CheckoutFormData>({
      initialValues: {
        customerName: "",
        whatsapp: "",
        email: "",
        cep: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        complemento: "",
        notes: "",
      },
      schema: checkoutValidationSchema,
    });

  const steps = ["Identificação", "Endereço de Entrega", "Confirmar Pedido"];

  const handleNext = async () => {
    if (activeStep === 0) {
      if (
        !data.customerName ||
        data.customerName.length < 3 ||
        !data.whatsapp ||
        data.whatsapp.length < 8
      ) {
        await validation();
        return;
      }
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (
        !data.cep ||
        !data.rua ||
        !data.numero ||
        !data.bairro ||
        !data.cidade
      ) {
        await validation();
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      if (submissionInProgress.current) return;
      submissionInProgress.current = true;

      try {
        const isValid = await validation();
        if (!isValid) return;

        const order = await createOrder.mutateAsync({
          customerName: data.customerName,
          whatsapp: data.whatsapp,
          email: data.email || undefined,
          address: {
            cep: data.cep,
            rua: data.rua,
            numero: data.numero,
            bairro: data.bairro,
            cidade: data.cidade,
            complemento: data.complemento || undefined,
          },
          items: items.map((i) => ({
            productId: i.id,
            productName: i.name,
            imageUrl: i.imageUrl,
            quantity: i.quantity,
            unitPrice: i.price,
            color: i.color,
          })),
          totalAmount: totalPrice,
          notes: data.notes || undefined,
        });

        setCreatedOrder(order);
        clearCart();
        setActiveStep(3);
      } catch {
        return;
      } finally {
        submissionInProgress.current = false;
      }
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  if (items.length === 0 && !createdOrder) {
    return (
      <Page.Root>
        <Page.Content>
          <Box sx={{ mt: 8, textAlign: "center", py: 8 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "background.default",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <ShoppingBag size={36} />
            </Box>
            <Typography variant="h5" fontWeight="800">
              Seu carrinho está vazio
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, mb: 3 }}
            >
              Selecione peças em nosso catálogo para prosseguir com o pedido.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
              sx={{ borderRadius: "40px", px: 4 }}
            >
              Ir para o Catálogo
            </Button>
          </Box>
        </Page.Content>
      </Page.Root>
    );
  }

  return (
    <Page.Root>
      <Page.Content>
        <Box sx={{ maxWidth: "md", mx: "auto", width: "100%", pb: 8 }}>
          {activeStep < 3 && (
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                mb: { xs: 3, sm: 5 },
                px: { xs: 0, sm: 1 },
                "& .MuiStepLabel-label": {
                  fontSize: { xs: "0.65rem", sm: "0.875rem" },
                  lineHeight: 1.2,
                  overflowWrap: "anywhere",
                },
                "& .MuiStep-root": { px: { xs: 0.25, sm: 1 } },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 4.5 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {activeStep === 3 && createdOrder ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CheckCircle2
                  size={68}
                  color="#2E7D32"
                  style={{ margin: "0 auto", marginBottom: 20 }}
                />

                <Typography
                  variant="h4"
                  fontWeight="900"
                  gutterBottom
                  sx={{
                    fontSize: { xs: "1.7rem", sm: "2.125rem" },
                    lineHeight: 1.15,
                  }}
                >
                  Pedido Registrado com Sucesso!
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  maxWidth={500}
                  mx="auto"
                >
                  Olá, <strong>{createdOrder.customerName}</strong>! Seu pedido
                  foi gravado em nossa fila de produção.
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    my: 3,
                    borderRadius: 3,
                    bgcolor: "background.default",
                    maxWidth: 420,
                    mx: "auto",
                    border: "2px dashed #D4AF37",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    textTransform="uppercase"
                    fontWeight="700"
                  >
                    Seu Código de Acompanhamento
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="900"
                    color="secondary.main"
                    sx={{
                      my: 1,
                      fontSize: { xs: "1.8rem", sm: "3rem" },
                      letterSpacing: "0.08em",
                    }}
                  >
                    {createdOrder.accessCode}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Número do Pedido: #{createdOrder.orderNumber}
                  </Typography>
                </Paper>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  maxWidth={500}
                  mx="auto"
                  mb={4}
                >
                  Guarde este código para acompanhar o status da produção a
                  qualquer momento pelo site.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="center"
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<MessageSquareShare size={20} />}
                    href={ordersService.buildWhatsAppMessage(
                      createdOrder,
                      companyPhone,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: "#25D366",
                      color: "#FFFFFF",
                      borderRadius: "40px",
                      px: 3.5,
                      py: 1.4,
                      fontWeight: 800,
                      width: { xs: "100%", sm: "auto" },
                      "&:hover": { bgcolor: "#1EBE5D" },
                    }}
                  >
                    Enviar Pedido via WhatsApp
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Search size={18} />}
                    onClick={() =>
                      navigate(`/tracking?code=${createdOrder.accessCode}`)
                    }
                    sx={{
                      borderRadius: "40px",
                      px: 3,
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Acompanhar Pedido
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 7 }}>
                  {activeStep === 0 && (
                    <Stack spacing={2.5}>
                      <Box>
                        <Typography variant="h6" fontWeight="800">
                          Identificação do Cliente
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Não é necessário criar conta nem senha.
                        </Typography>
                      </Box>

                      <TextField
                        label="Nome Completo *"
                        value={data.customerName}
                        onChange={(e) =>
                          changeValue("customerName", e.target.value)
                        }
                        {...validationErrors("customerName")}
                      />

                      <TextField
                        label="WhatsApp com DDD *"
                        placeholder="(11) 99999-9999"
                        value={data.whatsapp}
                        onChange={(e) =>
                          changeValue("whatsapp", e.target.value)
                        }
                        {...validationErrors("whatsapp")}
                      />

                      <TextField
                        label="E-mail (opcional)"
                        placeholder="seuemail@exemplo.com"
                        type="email"
                        value={data.email}
                        onChange={(e) => changeValue("email", e.target.value)}
                        {...validationErrors("email")}
                      />

                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        Usaremos seu WhatsApp para combinar detalhes do
                        pagamento e avisar quando a peça estiver pronta.
                      </Alert>
                    </Stack>
                  )}

                  {activeStep === 1 && (
                    <Stack spacing={2.5}>
                      <Box>
                        <Typography variant="h6" fontWeight="800">
                          Endereço para Entrega
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Informe onde deseja receber suas peças 3D.
                        </Typography>
                      </Box>

                      <TextField
                        label="CEP *"
                        placeholder="00000-000 (preenchimento automático)"
                        value={data.cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                        InputProps={{
                          endAdornment: isSearchingCep ? (
                            <CircularProgress size={18} color="secondary" />
                          ) : null,
                        }}
                        {...validationErrors("cep")}
                      />

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 8 }}>
                          <TextField
                            label="Rua / Logradouro *"
                            value={data.rua}
                            onChange={(e) => changeValue("rua", e.target.value)}
                            {...validationErrors("rua")}
                          />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          <TextField
                            label="Número *"
                            value={data.numero}
                            onChange={(e) =>
                              changeValue("numero", e.target.value)
                            }
                            {...validationErrors("numero")}
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        label="Bairro *"
                        value={data.bairro}
                        onChange={(e) => changeValue("bairro", e.target.value)}
                        {...validationErrors("bairro")}
                      />

                      <TextField
                        label="Cidade *"
                        value={data.cidade}
                        onChange={(e) => changeValue("cidade", e.target.value)}
                        {...validationErrors("cidade")}
                      />

                      <TextField
                        label="Complemento (Apto, bloco, referência)"
                        value={data.complemento}
                        onChange={(e) =>
                          changeValue("complemento", e.target.value)
                        }
                      />
                    </Stack>
                  )}

                  {activeStep === 2 && (
                    <Stack spacing={2.5}>
                      <Box>
                        <Typography variant="h6" fontWeight="800">
                          Confirmação do Pedido
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Revise seus dados antes de gravar a encomenda.
                        </Typography>
                      </Box>

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "background.default",
                        }}
                      >
                        <Typography
                          variant="caption"
                          fontWeight="bold"
                          textTransform="uppercase"
                          color="text.secondary"
                        >
                          Contato
                        </Typography>
                        <Typography variant="body2" fontWeight="700">
                          {data.customerName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {data.whatsapp} {data.email ? `• ${data.email}` : ""}
                        </Typography>

                        <Divider sx={{ my: 1.5 }} />

                        <Typography
                          variant="caption"
                          fontWeight="bold"
                          textTransform="uppercase"
                          color="text.secondary"
                        >
                          Endereço de Entrega
                        </Typography>
                        <Typography variant="body2">
                          {data.rua}, {data.numero}
                          {data.complemento ? ` (${data.complemento})` : ""}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {data.bairro} - {data.cidade} • CEP: {data.cep}
                        </Typography>
                      </Paper>

                      <TextField
                        label="Observações para a impressão (opcional)"
                        placeholder="Ex: preferência de tonalidade, embalagem para presente..."
                        multiline
                        rows={2}
                        value={data.notes}
                        onChange={(e) => changeValue("notes", e.target.value)}
                      />

                      <Alert severity="success" sx={{ borderRadius: 2 }}>
                        Ao confirmar, seu pedido será registrado e você receberá
                        um código para acompanhar a produção.
                      </Alert>
                    </Stack>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column-reverse", sm: "row" },
                      alignItems: { xs: "stretch", sm: "center" },
                      gap: 1,
                      justifyContent: "space-between",
                      mt: 4,
                    }}
                  >
                    <Button
                      disabled={activeStep === 0 || isSubmitting}
                      onClick={handleBack}
                      startIcon={<ArrowLeft size={16} />}
                      sx={{
                        borderRadius: "30px",
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      Voltar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={handleNext}
                      endIcon={<ArrowRight size={16} />}
                      sx={{
                        borderRadius: "30px",
                        px: 3.5,
                        fontWeight: 700,
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      {activeStep === steps.length - 1
                        ? isSubmitting
                          ? "Gravando..."
                          : "Confirmar Pedido"
                        : "Continuar"}
                    </Button>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: "background.default",
                      position: { xs: "static", md: "sticky" },
                      top: 100,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="800"
                      gutterBottom
                    >
                      Resumo da Encomenda
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Stack spacing={2} sx={{ mb: 2.5 }}>
                      {items.map((item) => (
                        <Box
                          key={`${item.id}__${item.color}`}
                          display="flex"
                          alignItems="center"
                          gap={1.5}
                        >
                          <Box
                            component="img"
                            src={item.imageUrl}
                            alt={item.name}
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 1.5,
                              objectFit: "cover",
                            }}
                          />
                          <Box flexGrow={1}>
                            <Typography
                              variant="body2"
                              fontWeight="700"
                              noWrap
                              sx={{ maxWidth: 170 }}
                            >
                              {item.name}
                            </Typography>
                            {item.color && (
                              <Box display="flex" alignItems="center" gap={0.8}>
                                <ColorSwatch colorName={item.color} size={10} />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {item.color} • {item.quantity} un
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          <Typography variant="body2" fontWeight="800">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Itens ({totalItems}):
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        R$ {totalPrice.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Produção:
                      </Typography>
                      <Chip
                        label="Sob demanda"
                        size="small"
                        color="secondary"
                        sx={{
                          fontSize: "0.65rem",
                          height: 20,
                          fontWeight: 700,
                        }}
                      />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" fontWeight="800">
                        Total:
                      </Typography>
                      <Typography
                        variant="h5"
                        fontWeight="900"
                        color="secondary.main"
                      >
                        R$ {totalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Box>
      </Page.Content>
    </Page.Root>
  );
}
