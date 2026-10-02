import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
  Chip,
  IconButton,
  TextField,
} from "@mui/material";
import {
  ArrowLeft,
  ShoppingCart,
  Clock,
  Layers,
  Maximize2,
  Sparkles,
  Plus,
  Minus,
  Paintbrush,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "../../../components/ui/Page";
import { useCart } from "../../../providers/CartContext";
import { useProduct } from "../../../hooks/useProducts";
import type { Product } from "../../../shared/interfaces/Product";
import ColorSwatch from "../../../components/common/ColorSwatch";
import CustomQuoteDialog from "../../../components/dialogs/CustomQuoteDialog";

const SCALE_OPTIONS = [
  { label: "Padrão (100%)", multiplier: 1 },
  { label: "Médio (+25%)", multiplier: 1.25 },
  { label: "Grande (+50%)", multiplier: 1.5 },
];

const MATERIAL_OPTIONS = [
  { label: "PLA Silk / Matte", addPrice: 0 },
  { label: "PETG Reforçado (+R$ 15)", addPrice: 15 },
];

interface ProductCustomization {
  productId: string | null;
  selectedColor: string;
  selectedScaleIndex: number;
  selectedMaterialIndex: number;
  selectedFinishIndex: number;
  paintInstructions: string;
  quantity: number;
}

const createInitialCustomization = (
  product?: Product,
): ProductCustomization => ({
  productId: product?.id ?? null,
  selectedColor: product?.availableColors?.[0] ?? "Preto",
  selectedScaleIndex: 0,
  selectedMaterialIndex: 0,
  selectedFinishIndex: 0,
  paintInstructions: "",
  quantity: 1,
});

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: product, isPending: loading, error } = useProduct(id);
  const [customization, setCustomization] = useState<ProductCustomization>(() =>
    createInitialCustomization(),
  );
  const [quoteOpen, setQuoteOpen] = useState(false);

  if (!product) {
    return (
      <Page.Root>
        <Page.Content>
          <Box py={8} textAlign="center">
            <Typography variant="h6">
              {error
                ? "Não foi possível carregar esta peça."
                : loading
                  ? "Carregando detalhes da peça..."
                  : "Peça não encontrada."}
            </Typography>
            <Button
              sx={{ mt: 2, borderRadius: "40px" }}
              variant="outlined"
              onClick={() => navigate("/")}
            >
              Voltar ao Catálogo
            </Button>
          </Box>
        </Page.Content>
      </Page.Root>
    );
  }

  const activeCustomization =
    customization.productId === product.id
      ? customization
      : createInitialCustomization(product);
  const {
    selectedColor,
    selectedScaleIndex,
    selectedMaterialIndex,
    selectedFinishIndex,
    paintInstructions,
    quantity,
  } = activeCustomization;

  const updateCustomization = (
    updates: Partial<Omit<ProductCustomization, "productId">>,
  ) => {
    setCustomization((current) => ({
      ...(current.productId === product.id
        ? current
        : createInitialCustomization(product)),
      ...updates,
      productId: product.id,
    }));
  };

  const paintingAddPrice = product?.paintingPrice ?? 35;

  const FINISH_OPTIONS = [
    { id: "filamento", label: "Cor do Filamento", addPrice: 0 },
    {
      id: "pintura",
      label: `Pintura Manual Artística (+R$ ${paintingAddPrice.toFixed(2)})`,
      addPrice: paintingAddPrice,
    },
  ];

  const currentScale = SCALE_OPTIONS[selectedScaleIndex];
  const currentMaterial = MATERIAL_OPTIONS[selectedMaterialIndex];
  const currentFinish = FINISH_OPTIONS[selectedFinishIndex];
  const unitPrice =
    Math.round(
      (product.price * currentScale.multiplier +
        currentMaterial.addPrice +
        currentFinish.addPrice) *
        100,
    ) / 100;

  const handleAddToCart = () => {
    const finishLabel =
      currentFinish.id === "pintura"
        ? `Pintura Manual Artística${paintInstructions ? ` (${paintInstructions})` : ""}`
        : `Filamento: ${selectedColor}`;

    addItem({
      id: `${product.id}_s${selectedScaleIndex}_m${selectedMaterialIndex}_f${selectedFinishIndex}_${selectedColor}`,
      name: `${product.name} (${currentScale.label.split(" ")[0]})`,
      price: unitPrice,
      quantity,
      imageUrl: product.imageUrl,
      color: `${finishLabel} • ${currentMaterial.label.split(" ")[0]}`,
    });
  };

  return (
    <Page.Root>
      <Page.Header>
        <Page.Title
          links={[
            { title: "Catálogo", path: "/" },
            { title: product.name, path: `/product/${product.id}` },
          ]}
        />
        <Page.HeaderActions>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
            variant="outlined"
            size="small"
            sx={{ borderRadius: "30px" }}
          >
            Voltar
          </Button>
        </Page.HeaderActions>
      </Page.Header>
      <Page.Content>
        <Grid
          container
          spacing={{ xs: 2.5, sm: 4, md: 7 }}
          sx={{ mb: { xs: 3, sm: 6 } }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                width: "100%",
                aspectRatio: { xs: "1 / 1", sm: "4 / 3", md: "1 / 1" },
                maxHeight: { xs: 360, sm: 460 },
                borderRadius: { xs: 2, sm: 4 },
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
              }}
            >
              <Box
                component="img"
                src={product.imageUrl}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2.5}>
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Chip
                  label={product.category}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontSize: "0.7rem",
                  }}
                />
                <Chip
                  label="Impressão Sob Demanda"
                  size="small"
                  color="secondary"
                  sx={{ fontWeight: 700, fontSize: "0.7rem" }}
                />
              </Box>

              <Typography
                variant="h3"
                fontWeight="900"
                sx={{
                  fontSize: { xs: "1.9rem", sm: "2.5rem", md: "3rem" },
                  lineHeight: 1.1,
                  overflowWrap: "anywhere",
                }}
              >
                {product.name}
              </Typography>

              <Box display="flex" alignItems="baseline" gap={1}>
                <Typography
                  variant="h3"
                  fontWeight="900"
                  color="secondary.main"
                  sx={{ fontSize: { xs: "1.8rem", sm: "2.5rem" } }}
                >
                  R$ {unitPrice.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  / unidade
                </Typography>
              </Box>

              {product.description && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  lineHeight={1.8}
                >
                  {product.description}
                </Typography>
              )}

              <Divider />

              <Stack spacing={1}>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Escala / Tamanho da Peça:
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {SCALE_OPTIONS.map((scale, idx) => (
                    <Chip
                      key={scale.label}
                      label={scale.label}
                      clickable
                      onClick={() =>
                        updateCustomization({ selectedScaleIndex: idx })
                      }
                      variant={
                        selectedScaleIndex === idx ? "filled" : "outlined"
                      }
                      color={selectedScaleIndex === idx ? "primary" : "default"}
                      size="small"
                      sx={{
                        fontWeight: selectedScaleIndex === idx ? 800 : 500,
                        maxWidth: "100%",
                        height: "auto",
                        "& .MuiChip-label": { whiteSpace: "normal", py: 0.5 },
                      }}
                    />
                  ))}
                </Stack>
              </Stack>

              <Stack spacing={1}>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Material / Filamento:
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {MATERIAL_OPTIONS.map((mat, idx) => (
                    <Chip
                      key={mat.label}
                      label={mat.label}
                      clickable
                      onClick={() =>
                        updateCustomization({ selectedMaterialIndex: idx })
                      }
                      variant={
                        selectedMaterialIndex === idx ? "filled" : "outlined"
                      }
                      color={
                        selectedMaterialIndex === idx ? "primary" : "default"
                      }
                      size="small"
                      sx={{
                        fontWeight: selectedMaterialIndex === idx ? 800 : 500,
                        maxWidth: "100%",
                        height: "auto",
                        "& .MuiChip-label": { whiteSpace: "normal", py: 0.5 },
                      }}
                    />
                  ))}
                </Stack>
              </Stack>

              <Stack spacing={1}>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Acabamento da Peça:
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {FINISH_OPTIONS.map((fin, idx) => (
                    <Chip
                      key={fin.id}
                      icon={
                        fin.id === "pintura" ? (
                          <Paintbrush size={14} />
                        ) : undefined
                      }
                      label={fin.label}
                      clickable
                      onClick={() =>
                        updateCustomization({ selectedFinishIndex: idx })
                      }
                      variant={
                        selectedFinishIndex === idx ? "filled" : "outlined"
                      }
                      color={
                        selectedFinishIndex === idx ? "primary" : "default"
                      }
                      size="small"
                      sx={{
                        fontWeight: selectedFinishIndex === idx ? 800 : 500,
                        maxWidth: "100%",
                        height: "auto",
                        "& .MuiChip-label": { whiteSpace: "normal", py: 0.5 },
                      }}
                    />
                  ))}
                </Stack>
              </Stack>

              {currentFinish.id === "filamento" ? (
                <Stack spacing={1.5}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight="800"
                      textTransform="uppercase"
                    >
                      Cor do Filamento:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="secondary.main"
                      fontWeight="700"
                    >
                      {selectedColor}
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    useFlexGap
                    flexWrap="wrap"
                  >
                    {(
                      product.availableColors || ["Preto", "Branco", "Dourado"]
                    ).map((c) => (
                      <ColorSwatch
                        key={c}
                        colorName={c}
                        selected={selectedColor === c}
                        size={32}
                        onClick={() =>
                          updateCustomization({ selectedColor: c })
                        }
                      />
                    ))}
                  </Stack>
                </Stack>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: "grey.50",
                    border: "1px dashed",
                    borderColor: "primary.main",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    display="block"
                  >
                    🎨 <strong>Pintura Manual Artística:</strong> A peça é
                    tratada com primer automotivo cinza e pintada à mão com
                    acabamento profissional e verniz. A cor original do
                    filamento é totalmente recoberta.
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="Instruções ou referências de cores (opcional)..."
                    value={paintInstructions}
                    onChange={(e) =>
                      updateCustomization({ paintInstructions: e.target.value })
                    }
                    fullWidth
                    sx={{ mt: 1.5, bgcolor: "background.paper" }}
                  />
                </Box>
              )}

              <Grid container spacing={2} sx={{ py: 1 }}>
                {product.material && (
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Box
                      p={2}
                      borderRadius={2}
                      bgcolor="background.default"
                      border="1px solid"
                      borderColor="divider"
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Layers size={16} />
                        <Typography variant="caption" color="text.secondary">
                          Material
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="700">
                        {currentMaterial.label.split(" ")[0]}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {product.printTimeHours && (
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Box
                      p={2}
                      borderRadius={2}
                      bgcolor="background.default"
                      border="1px solid"
                      borderColor="divider"
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Clock size={16} />
                        <Typography variant="caption" color="text.secondary">
                          Tempo Est.
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="700">
                        ~
                        {Math.round(
                          product.printTimeHours * currentScale.multiplier,
                        )}{" "}
                        horas
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {product.dimensions && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box
                      p={2}
                      borderRadius={2}
                      bgcolor="background.default"
                      border="1px solid"
                      borderColor="divider"
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Maximize2 size={16} />
                        <Typography variant="caption" color="text.secondary">
                          Dimensões
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="700">
                        {product.dimensions}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Divider />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  border="1px solid"
                  borderColor="divider"
                  borderRadius="40px"
                  bgcolor="background.paper"
                  px={1}
                >
                  <IconButton
                    size="small"
                    disabled={quantity <= 1}
                    onClick={() =>
                      updateCustomization({
                        quantity: Math.max(1, quantity - 1),
                      })
                    }
                  >
                    <Minus size={16} />
                  </IconButton>
                  <Typography sx={{ px: 2, fontWeight: 700 }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      updateCustomization({ quantity: quantity + 1 })
                    }
                  >
                    <Plus size={16} />
                  </IconButton>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCart size={20} />}
                  onClick={handleAddToCart}
                  sx={{
                    borderRadius: "40px",
                    py: 1.5,
                    fontWeight: 800,
                  }}
                >
                  Adicionar ao Carrinho • R$ {(unitPrice * quantity).toFixed(2)}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setQuoteOpen(true)}
                  startIcon={<Sparkles size={18} />}
                  sx={{
                    borderRadius: "40px",
                    py: 1.5,
                    px: 3,
                    width: { xs: "100%", sm: "auto" },
                    borderColor: "secondary.main",
                    color: "secondary.main",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Modificar Peça
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <CustomQuoteDialog
          open={quoteOpen}
          onClose={() => setQuoteOpen(false)}
        />
      </Page.Content>
    </Page.Root>
  );
}
