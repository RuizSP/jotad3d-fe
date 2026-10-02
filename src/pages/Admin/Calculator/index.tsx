import { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Slider,
  Button,
  Stack,
  Divider,
  Chip,
  Snackbar,
  Alert,
  InputAdornment,
  Paper,
  MenuItem,
} from "@mui/material";
import {
  Calculator as CalcIcon,
  Zap,
  Disc,
  Clock,
  TrendingUp,
  PlusCircle,
  Package,
  Wrench,
  CheckCircle2,
  Paintbrush,
} from "lucide-react";
import { useDialogs } from "@toolpad/core";
import { Page } from "../../../components/ui/Page";
import ProductFormDialog from "../../../components/dialogs/ProductFormDialog";
import { useProducts } from "../../../hooks/useProducts";
import CopyButton from "../../../components/ui/CopyButton";

const NEW_PRODUCT_VALUE = "__new__";

export default function AdminCalculator() {
  const dialogs = useDialogs();

  const { data: products = [] } = useProducts();
  const [selectedProductId, setSelectedProductId] =
    useState<string>(NEW_PRODUCT_VALUE);
  const [modelName, setModelName] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [weightGrams, setWeightGrams] = useState(0);
  const [spoolPriceKg, setSpoolPriceKg] = useState(0);
  const [lossMarginPercent, setLossMarginPercent] = useState(0);

  const [printTimeHours, setPrintTimeHours] = useState(0);
  const [printerPowerWatts, setPrinterPowerWatts] = useState(0);
  const [energyCostKWh, setEnergyCostKWh] = useState(0);

  const [printerCost, setPrinterCost] = useState(0);
  const [printerLifeHours, setPrinterLifeHours] = useState(0);

  const [suppliesCost, setSuppliesCost] = useState(0);
  const [laborMinutes, setLaborMinutes] = useState(0);
  const [laborHourlyRate, setLaborHourlyRate] = useState(0);

  const [paintingMinutes, setPaintingMinutes] = useState(0);
  const [paintingSuppliesCost, setPaintingSuppliesCost] = useState(0);

  const [markupPercent, setMarkupPercent] = useState(100);

  const [copiedSnackbar, setCopiedSnackbar] = useState(false);

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    if (productId === NEW_PRODUCT_VALUE) {
      setModelName("");
      setMaterialType("");
      setPrintTimeHours(0);
      return;
    }
    const found = products.find((p) => p.id === productId);
    if (found) {
      setModelName(found.name);
      setMaterialType(found.material || "");
      setPrintTimeHours(found.printTimeHours ?? 0);
    }
  };

  const calculations = useMemo(() => {
    const rawMaterial =
      (weightGrams * (1 + lossMarginPercent / 100) * spoolPriceKg) / 1000;
    const energy = printTimeHours * (printerPowerWatts / 1000) * energyCostKWh;
    const depreciation =
      printerLifeHours > 0
        ? printTimeHours * (printerCost / printerLifeHours)
        : 0;
    const labor = (laborMinutes / 60) * laborHourlyRate;
    const supplies = Number(suppliesCost) || 0;

    const totalCost = rawMaterial + energy + depreciation + labor + supplies;
    const suggestedPrice = totalCost * (1 + markupPercent / 100);
    const netProfit = suggestedPrice - totalCost;
    const profitMargin =
      suggestedPrice > 0 ? (netProfit / suggestedPrice) * 100 : 0;

    const paintingLabor = (paintingMinutes / 60) * laborHourlyRate;
    const paintingTotalCost = Number(paintingSuppliesCost) + paintingLabor;
    const suggestedPaintingAddon = Math.round(
      paintingTotalCost * (1 + markupPercent / 100),
    );
    const suggestedPriceWithPainting =
      Math.round((suggestedPrice + suggestedPaintingAddon) * 100) / 100;

    return {
      rawMaterial,
      energy,
      depreciation,
      labor,
      supplies,
      totalCost,
      suggestedPrice,
      netProfit,
      profitMargin,
      paintingTotalCost,
      suggestedPaintingAddon,
      suggestedPriceWithPainting,
    };
  }, [
    weightGrams,
    lossMarginPercent,
    spoolPriceKg,
    printTimeHours,
    printerPowerWatts,
    energyCostKWh,
    printerCost,
    printerLifeHours,
    laborMinutes,
    laborHourlyRate,
    suppliesCost,
    markupPercent,
    paintingMinutes,
    paintingSuppliesCost,
  ]);

  const budgetText = [
    "✨ *Orçamento de Impressão 3D - JOTAD3D* ✨",
    "",
    `📦 *Peça:* ${modelName || "Sem nome"}`,
    `🧵 *Material / Filamento:* ${materialType || "Não informado"} (~${weightGrams}g)`,
    `⏱️ *Tempo Estimado de Produção:* ${printTimeHours}h`,
    `🛠️ *Acabamento Padrão:* Incluso`,
    "",
    `💰 *Opção 1 (Cor do Filamento):* R$ ${calculations.suggestedPrice.toFixed(2)}`,
    `🎨 *Opção 2 (Com Pintura Manual Artística):* R$ ${calculations.suggestedPriceWithPainting.toFixed(2)} (+R$ ${calculations.suggestedPaintingAddon.toFixed(2)})`,
    "",
    "💳 *Forma de Pagamento:* PIX à vista ou Cartão de Crédito",
    "🚚 *Envio / Retirada:* Enviamos para todo o Brasil ou retirada local",
    "",
    "Para confirmar a produção e escolher a opção, responda esta mensagem!",
  ].join("\n");

  const handleAddToCatalog = async () => {
    await dialogs.open(ProductFormDialog, {
      id: selectedProductId !== NEW_PRODUCT_VALUE ? selectedProductId : "",
      name: modelName,
      price: Number(calculations.suggestedPrice.toFixed(2)),
      paintingPrice:
        calculations.suggestedPaintingAddon > 0
          ? calculations.suggestedPaintingAddon
          : undefined,
      material: materialType,
      printTimeHours: Number(printTimeHours),
      category: "Decoração",
      imageUrl: "",
      description: materialType
        ? `Peça impressa em 3D em ${materialType}. Peso aproximado: ${weightGrams}g.`
        : "",
      availableColors: ["Preto", "Branco", "Dourado"],
      inStock: true,
    });
  };

  return (
    <Page.Root>
      <Page.Content>
        <Box mb={3}>
          <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
            <CalcIcon size={26} color="#D4AF37" />
            <Typography variant="h5" fontWeight="800">
              Calculadora Técnica de Custos 3D
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Simulador de custos de filamento, energia, depreciação e mão de obra
            para precificação profissional de encomendas FDM e Resina.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Stack spacing={2.5}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Package size={18} color="#D4AF37" />
                    <Typography variant="subtitle1" fontWeight="700">
                      Identificação do Modelo
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 7 }}>
                      <TextField
                        select
                        fullWidth
                        label="Produto do Catálogo"
                        value={selectedProductId}
                        onChange={(e) => handleProductSelect(e.target.value)}
                      >
                        <MenuItem value={NEW_PRODUCT_VALUE}>
                          ➕ Novo Produto (sem cadastro)
                        </MenuItem>
                        {products.map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            {p.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <TextField
                        fullWidth
                        label="Nome da Peça / Projeto"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Disc size={18} color="#D4AF37" />
                    <Typography variant="subtitle1" fontWeight="700">
                      Material (Filamento / Resina)
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        label="Tipo de Filamento / Resina"
                        value={materialType}
                        onChange={(e) => setMaterialType(e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Peso do Modelo (Fatiador)"
                        value={weightGrams || ""}
                        onChange={(e) => setWeightGrams(Number(e.target.value))}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">g</InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Preço do Carretel (1kg)"
                        value={spoolPriceKg || ""}
                        onChange={(e) =>
                          setSpoolPriceKg(Number(e.target.value))
                        }
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                R$
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Perda / Suportes"
                        value={lossMarginPercent || ""}
                        onChange={(e) =>
                          setLossMarginPercent(Number(e.target.value))
                        }
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Clock size={18} color="#D4AF37" />
                    <Typography variant="subtitle1" fontWeight="700">
                      Tempo de Máquina & Eletricidade
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Tempo de Impressão"
                        value={printTimeHours || ""}
                        onChange={(e) =>
                          setPrintTimeHours(Number(e.target.value))
                        }
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">h</InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Consumo Médio"
                        value={printerPowerWatts || ""}
                        onChange={(e) =>
                          setPrinterPowerWatts(Number(e.target.value))
                        }
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">W</InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Custo Energia Elétrica"
                        value={energyCostKWh || ""}
                        onChange={(e) =>
                          setEnergyCostKWh(Number(e.target.value))
                        }
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                R$
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                /kWh
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Wrench size={18} color="#D4AF37" />
                    <Typography variant="subtitle1" fontWeight="700">
                      Depreciação, Insumos & Mão de Obra
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Valor Impressora"
                        value={printerCost || ""}
                        onChange={(e) => setPrinterCost(Number(e.target.value))}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                R$
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Vida Útil Est."
                        value={printerLifeHours || ""}
                        onChange={(e) =>
                          setPrinterLifeHours(Number(e.target.value))
                        }
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">h</InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Embalagem/Insumos"
                        value={suppliesCost || ""}
                        onChange={(e) =>
                          setSuppliesCost(Number(e.target.value))
                        }
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                R$
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Acabamento (min)"
                        value={laborMinutes || ""}
                        onChange={(e) =>
                          setLaborMinutes(Number(e.target.value))
                        }
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                min
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Hora Mão de Obra"
                        value={laborHourlyRate || ""}
                        onChange={(e) =>
                          setLaborHourlyRate(Number(e.target.value))
                        }
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                R$
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">/h</InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Paintbrush size={18} color="#D4AF37" />
                    <Typography variant="subtitle1" fontWeight="700">
                      Simulação de Pintura Manual Artística
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Tempo de Pintura / Lixamento"
                        value={paintingMinutes || ""}
                        onChange={(e) =>
                          setPaintingMinutes(Number(e.target.value))
                        }
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                min
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Insumos (Primer, Tintas, Verniz)"
                        value={paintingSuppliesCost || ""}
                        onChange={(e) =>
                          setPaintingSuppliesCost(Number(e.target.value))
                        }
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                R$
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <TrendingUp size={18} color="#D4AF37" />
                    <Typography variant="subtitle1" fontWeight="700">
                      Margem de Lucro Desejada (Markup)
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={3} mt={1}>
                    <Slider
                      value={markupPercent}
                      min={10}
                      max={300}
                      step={5}
                      onChange={(_, val) => setMarkupPercent(val as number)}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(val) => `${val}%`}
                      sx={{ color: "primary.main" }}
                    />
                    <Chip
                      label={`${markupPercent}%`}
                      color="primary"
                      sx={{ fontWeight: 800, minWidth: 70 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <Stack spacing={2.5} sx={{ position: "sticky", top: 88 }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  borderColor: "primary.main",
                  borderWidth: 2,
                  bgcolor: "background.paper",
                }}
              >
                <CardContent>
                  <Typography
                    variant="caption"
                    fontWeight="800"
                    color="text.secondary"
                    textTransform="uppercase"
                    letterSpacing={1}
                  >
                    Resumo do Cálculo
                  </Typography>

                  <Box my={2}>
                    <Typography variant="caption" color="text.secondary">
                      Preço Base (Cor do Filamento):
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="900"
                      color="primary.main"
                      letterSpacing="-0.5px"
                    >
                      R$ {calculations.suggestedPrice.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Lucro Líquido Base:{" "}
                      <strong style={{ color: "#2e7d32" }}>
                        R$ {calculations.netProfit.toFixed(2)}
                      </strong>{" "}
                      ({calculations.profitMargin.toFixed(1)}% sobre a venda)
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      bgcolor="grey.100"
                      p={1.5}
                      borderRadius={2}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          fontWeight="800"
                          color="secondary.main"
                          display="block"
                        >
                          🎨 Com Pintura Manual Artística:
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Adicional: +R${" "}
                          {calculations.suggestedPaintingAddon.toFixed(2)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        fontWeight="900"
                        color="secondary.main"
                      >
                        R$ {calculations.suggestedPriceWithPainting.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography
                    variant="caption"
                    fontWeight="700"
                    color="text.secondary"
                    textTransform="uppercase"
                    display="block"
                    mb={1.5}
                  >
                    Detalhamento dos Custos
                  </Typography>

                  <Stack spacing={1.2}>
                    <Box display="flex" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Disc size={15} color="#888" />
                        <Typography variant="body2">
                          Filamento ({weightGrams}g):
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="600">
                        R$ {calculations.rawMaterial.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Zap size={15} color="#888" />
                        <Typography variant="body2">
                          Energia ({printTimeHours}h):
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="600">
                        R$ {calculations.energy.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Wrench size={15} color="#888" />
                        <Typography variant="body2">
                          Depreciação Máquina:
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="600">
                        R$ {calculations.depreciation.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Clock size={15} color="#888" />
                        <Typography variant="body2">
                          Mão de Obra ({laborMinutes}min):
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="600">
                        R$ {calculations.labor.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Package size={15} color="#888" />
                        <Typography variant="body2">
                          Insumos / Embalagem:
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="600">
                        R$ {calculations.supplies.toFixed(2)}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" fontWeight="800">
                        Custo de Produção Total:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="800"
                        color="text.primary"
                      >
                        R$ {calculations.totalCost.toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={1.5} mt={3}>
                    <CopyButton
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      value={budgetText}
                      onCopied={() => setCopiedSnackbar(true)}
                      sx={{ fontWeight: 800, borderRadius: 2 }}
                    >
                      Copiar Orçamento WhatsApp
                    </CopyButton>

                    <Button
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      size="large"
                      startIcon={<PlusCircle size={18} />}
                      onClick={handleAddToCatalog}
                      sx={{ fontWeight: 700, borderRadius: 2 }}
                    >
                      Cadastrar Peça no Catálogo
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Paper
                variant="outlined"
                sx={{ p: 2, borderRadius: 3, bgcolor: "grey.50" }}
              >
                <Typography variant="caption" color="text.secondary">
                  💡 <strong>Dica JOTAD3D:</strong> Em peças personalizadas com
                  fatiamento complexo ou suportes orgânicos, adicione pelo menos
                  15% na perda de filamento para cobrir purgamento e testes de
                  tolerância mecânica.
                </Typography>
              </Paper>
            </Stack>
          </Grid>
        </Grid>

        <Snackbar
          open={copiedSnackbar}
          autoHideDuration={3000}
          onClose={() => setCopiedSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setCopiedSnackbar(false)}
            severity="success"
            icon={<CheckCircle2 size={18} />}
            sx={{ width: "100%", fontWeight: 600 }}
          >
            Orçamento formatado copiado para a área de transferência!
          </Alert>
        </Snackbar>
      </Page.Content>
    </Page.Root>
  );
}
