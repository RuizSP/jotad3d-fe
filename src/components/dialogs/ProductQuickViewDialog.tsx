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

const FINISH_OPTIONS = [
  { id: "filamento", label: "Cor do Filamento", addPrice: 0 },
  { id: "pintura", label: "Pintura Manual Artística (+R$ 35)", addPrice: 35 },
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
        ? `Pintura Artística Manual${paintInstructions ? ` (${paintInstructions})` : ""}`
        : `Filamento: ${selectedColor}`;

    addItem({
      id: `${product.id}_s${selectedScaleIndex}_m${selectedMaterialIndex}_f${selectedFinishIndex}_${selectedColor}`,
      name: `${product.name} (${currentScale.label.split(" ")[0]})`,
      price: unitPrice,
      quantity,
      imageUrl: product.imageUrl,
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
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                width: "100%",
                height: 340,
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "background.default",
                border: "1px solid",
                borderColor: "divider",
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
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
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
                <Stack direction="row" spacing={1}>
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
                <Stack direction="row" spacing={1}>
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
                <Stack direction="row" spacing={1}>
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
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "grey.50",
                    border: "1px dashed",
                    borderColor: "primary.main",
                  }}
                >
                  <Typography
                    variant="caption"
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
                    onChange={(e) => setPaintInstructions(e.target.value)}
                    fullWidth
                    sx={{ mt: 1, bgcolor: "background.paper" }}
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
