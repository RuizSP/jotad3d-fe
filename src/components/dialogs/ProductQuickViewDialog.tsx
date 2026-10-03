import { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Grid,
  Chip,
  Divider,
  TextField,
} from "@mui/material";
import {
  Plus,
  Minus,
  ShoppingCart,
  Clock,
  Layers,
  Maximize2,
  Paintbrush,
} from "lucide-react";
import type { Product } from "../../shared/interfaces/Product";
import { useCart } from "../../providers/CartContext";
import ColorSwatch from "../common/ColorSwatch";
import { Dialog } from "../ui/Dialog";
import ProductGallery from "../common/ProductGallery";
import { getVariantImages } from "../../shared/productImages";

interface ProductQuickViewDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const SCALE_OPTIONS = [
  { label: "Padrão (100%)", multiplier: 1 },
  { label: "Médio (+25%)", multiplier: 1.25 },
  { label: "Grande (+50%)", multiplier: 1.5 },
];

const MATERIAL_OPTIONS = [
  { label: "PLA Silk / Matte", addPrice: 0 },
  { label: "PETG Reforçado (+R$ 15)", addPrice: 15 },
];

export default function ProductQuickViewDialog({
  product,
  open,
  onClose,
}: ProductQuickViewDialogProps) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.availableColors?.[0] ?? "Preto",
  );
  const [selectedScaleIndex, setSelectedScaleIndex] = useState<number>(0);
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState<number>(0);
  const [selectedFinishIndex, setSelectedFinishIndex] = useState<number>(0);
  const [paintInstructions, setPaintInstructions] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) return null;

  const paintingPrice = product.paintingPrice ?? 35;
  const finishOptions = [
    { id: "filamento", label: "Cor do Filamento", addPrice: 0 },
    {
      id: "pintura",
      label: `Pintura Manual Artística (+R$ ${paintingPrice.toFixed(2)})`,
      addPrice: paintingPrice,
    },
  ];
  const currentScale = SCALE_OPTIONS[selectedScaleIndex];
  const currentMaterial = MATERIAL_OPTIONS[selectedMaterialIndex];
  const currentFinish = finishOptions[selectedFinishIndex];
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
        ? `Pintura Artística Manual${paintInstructions ? ` (${paintInstructions})` : ""}`
        : `Filamento: ${selectedColor}`;

    addItem({
      id: `${product.id}_s${selectedScaleIndex}_m${selectedMaterialIndex}_f${selectedFinishIndex}_${selectedColor}`,
      name: `${product.name} (${currentScale.label.split(" ")[0]})`,
      price: unitPrice,
      quantity,
      imageUrl: getVariantImages(product, selectedColor, currentFinish.id === "pintura")[0] || product.imageUrl,
      color: `${finishLabel} • ${currentMaterial.label.split(" ")[0]}`,
    });
    onClose();
  };

  return (
    <Dialog.Root open={open} onClose={async () => onClose()} maxWidth="md">
      <Dialog.Header>
        <Dialog.Title title={product.name} />
        <Dialog.ActionClose onClose={async () => onClose()} />
      </Dialog.Header>

      <Dialog.Content>
        <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <ProductGallery product={product} color={selectedColor} painted={currentFinish.id === "pintura"} compact />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Chip
                  label={product.category}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                    letterSpacing: "0.05em",
                  }}
                />
                <Chip
                  label="Preço Atualizado Dinamicamente"
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ fontSize: "0.7rem", fontWeight: 700 }}
                />
              </Box>

              <Box display="flex" alignItems="baseline" gap={1}>
                <Typography
                  variant="h4"
                  fontWeight="800"
                  color="secondary.main"
                >
                  R$ {unitPrice.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  / unidade
                </Typography>
              </Box>

              {product.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  lineHeight={1.5}
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
                      onClick={() => setSelectedScaleIndex(idx)}
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
                      onClick={() => setSelectedMaterialIndex(idx)}
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
                  {finishOptions.map((fin, idx) => (
                    <Chip
                      key={fin.id}
                      icon={
                        fin.id === "pintura" ? (
                          <Paintbrush size={14} />
                        ) : undefined
                      }
                      label={fin.label}
                      clickable
                      onClick={() => setSelectedFinishIndex(idx)}
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
                <Stack spacing={1}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="caption"
                      fontWeight="bold"
                      textTransform="uppercase"
                    >
                      Cor do Filamento: <strong>{selectedColor}</strong>
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    {(
                      product.availableColors || ["Preto", "Branco", "Dourado"]
                    ).map((colorName) => (
                      <ColorSwatch
                        key={colorName}
                        colorName={colorName}
                        selected={selectedColor === colorName}
                        size={26}
                        onClick={() => setSelectedColor(colorName)}
                      />
                    ))}
                  </Stack>
                </Stack>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Stack spacing={0.75} mb={2}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Pintura manual artística
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pintura à mão com primer e verniz. A cor original do
                      filamento fica recoberta.
                    </Typography>
                  </Stack>
                  <TextField
                    size="small"
                    label="Instruções ou referências de cores"
                    placeholder="Ex.: tons de azul e detalhes dourados"
                    value={paintInstructions}
                    onChange={(e) => setPaintInstructions(e.target.value)}
                    fullWidth
                    multiline
                    minRows={2}
                    helperText="Opcional"
                    sx={{
                      "& .MuiOutlinedInput-root": { bgcolor: "background.paper" },
                    }}
                  />
                </Box>
              )}

              <Stack direction="row" spacing={3} sx={{ py: 0.5 }}>
                {product.dimensions && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Maximize2 size={15} />
                    <Typography variant="caption" color="text.secondary">
                      {product.dimensions}
                    </Typography>
                  </Box>
                )}
                {product.printTimeHours && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Clock size={15} />
                    <Typography variant="caption" color="text.secondary">
                      ~
                      {Math.round(
                        product.printTimeHours * currentScale.multiplier,
                      )}
                      h
                    </Typography>
                  </Box>
                )}
                <Box display="flex" alignItems="center" gap={1}>
                  <Layers size={15} />
                  <Typography variant="caption" color="text.secondary">
                    {currentMaterial.label.split(" ")[0]}
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  display="flex"
                  alignItems="center"
                  border="1px solid"
                  borderColor="divider"
                  borderRadius="40px"
                  px={1}
                >
                  <IconButton
                    size="small"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus size={16} />
                  </IconButton>
                  <Typography sx={{ px: 2, fontWeight: 700 }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus size={16} />
                  </IconButton>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={<ShoppingCart size={18} />}
                  onClick={handleAddToCart}
                  sx={{
                    borderRadius: "40px",
                    py: 1.2,
                    fontWeight: 700,
                  }}
                >
                  Adicionar • R$ {(unitPrice * quantity).toFixed(2)}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  );
}
