import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import {
  TextField,
  Stack,
  Grid,
  MenuItem,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import type { DialogProps } from "@toolpad/core";
import { Dialog } from "../ui/Dialog";
import { useForm } from "../../hooks/useForm";
import { useCreateProduct, useUpdateProduct } from "../../hooks/useProducts";
import { PRODUCT_COLORS, type Product } from "../../shared/interfaces/Product";
import ColorSwatch from "../common/ColorSwatch";

interface ProductFormData {
  name: string;
  category: string;
  price: number | string;
  material: string;
  dimensions: string;
  printTimeHours: number | string;
  description: string;
  imageUrl: string;
}

const CATEGORY_OPTIONS = [
  "Decoração",
  "Colecionáveis",
  "Setup & Escritório",
  "Engenharia",
  "Utilitários",
  "Outros",
];

const MATERIAL_OPTIONS = [
  "PLA Silk Premium",
  "PLA Matte",
  "PLA Duocolor Especial",
  "PETG Reforçado",
  "PETG Técnico",
  "ABS Automotivo",
  "Resina 8K Ultra",
];

const productValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Informe o nome da peça")
    .min(3, "Mínimo 3 caracteres"),
  category: Yup.string().required("Selecione a categoria"),
  price: Yup.number()
    .typeError("Preço inválido")
    .positive("Deve ser maior que zero")
    .required("Informe o preço"),
  material: Yup.string(),
  dimensions: Yup.string(),
  printTimeHours: Yup.number().typeError("Tempo inválido").min(0),
  description: Yup.string(),
  imageUrl: Yup.string()
    .url("URL de imagem inválida")
    .required("Informe a URL da imagem"),
});

export default function ProductFormDialog({
  open,
  onClose,
  payload,
}: DialogProps<Product | null, boolean>) {
  const isEditing = Boolean(payload && payload.id);
  const [selectedColors, setSelectedColors] = useState<string[]>(
    payload?.availableColors || ["Preto", "Branco", "Dourado"],
  );
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const submitting = createProduct.isPending || updateProduct.isPending;
  const submissionInProgress = useRef(false);

  const { data, changeValue, validation, validationErrors, setData } =
    useForm<ProductFormData>({
      initialValues: {
        name: payload?.name || "",
        category: payload?.category || "Decoração",
        price: payload?.price || "",
        material: payload?.material || "PLA Silk Premium",
        dimensions: payload?.dimensions || "",
        printTimeHours: payload?.printTimeHours || "",
        description: payload?.description || "",
        imageUrl: payload?.imageUrl || "",
      },
      schema: productValidationSchema,
    });

  useEffect(() => {
    if (payload) {
      setData({
        name: payload.name || "",
        category: payload.category || "Decoração",
        price: payload.price ?? "",
        material: payload.material || "PLA Silk Premium",
        dimensions: payload.dimensions || "",
        printTimeHours: payload.printTimeHours ?? "",
        description: payload.description || "",
        imageUrl: payload.imageUrl || "",
      });
      setSelectedColors(
        payload.availableColors || ["Preto", "Branco", "Dourado"],
      );
    }
  }, [payload, setData]);

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName],
    );
  };

  const handleSubmit = async () => {
    if (submissionInProgress.current) return;

    submissionInProgress.current = true;
    try {
      const isValid = await validation();
      if (!isValid) return;

      const productPayload = {
        name: data.name,
        category: data.category,
        price: Number(data.price),
        paintingPrice: payload?.paintingPrice,
        material: data.material,
        dimensions: data.dimensions || undefined,
        printTimeHours: data.printTimeHours
          ? Number(data.printTimeHours)
          : undefined,
        description: data.description,
        imageUrl: data.imageUrl,
        availableColors:
          selectedColors.length > 0 ? selectedColors : ["Preto", "Dourado"],
        inStock: true,
      };

      if (isEditing && payload) {
        await updateProduct.mutateAsync({
          id: payload.id,
          updates: productPayload,
        });
      } else {
        await createProduct.mutateAsync(productPayload);
      }

      await onClose(true);
    } catch {
      return;
    } finally {
      submissionInProgress.current = false;
    }
  };

  return (
    <Dialog.Root open={open} onClose={() => onClose(false)} maxWidth="md">
      <Dialog.Header>
        <Dialog.Title
          title={
            isEditing ? "Editar Peça do Catálogo" : "Cadastrar Nova Peça 3D"
          }
        />
        <Dialog.ActionClose onClose={async () => onClose(false)} />
      </Dialog.Header>

      <Dialog.Content>
        <Stack spacing={2.5}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Nome da Peça *"
                value={data.name}
                onChange={(e) => changeValue("name", e.target.value)}
                {...validationErrors("name")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                select
                label="Categoria *"
                value={data.category}
                onChange={(e) => changeValue("category", e.target.value)}
                {...validationErrors("category")}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Preço Base (R$) *"
                type="number"
                placeholder="49.90"
                value={data.price}
                onChange={(e) => changeValue("price", e.target.value)}
                {...validationErrors("price")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                select
                label="Material / Filamento"
                value={data.material}
                onChange={(e) => changeValue("material", e.target.value)}
              >
                {MATERIAL_OPTIONS.map((mat) => (
                  <MenuItem key={mat} value={mat}>
                    {mat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Tempo Est. (horas)"
                type="number"
                placeholder="6"
                value={data.printTimeHours}
                onChange={(e) => changeValue("printTimeHours", e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Dimensões (Ex: 12 x 12 x 20 cm)"
                value={data.dimensions}
                onChange={(e) => changeValue("dimensions", e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="URL da Imagem da Peça *"
                placeholder="https://..."
                value={data.imageUrl}
                onChange={(e) => changeValue("imageUrl", e.target.value)}
                {...validationErrors("imageUrl")}
              />
            </Grid>
          </Grid>

          <TextField
            label="Descrição Detalhada da Peça"
            multiline
            rows={3}
            value={data.description}
            onChange={(e) => changeValue("description", e.target.value)}
          />

          <Box>
            <Typography
              variant="caption"
              fontWeight="bold"
              textTransform="uppercase"
              display="block"
              mb={1}
            >
              Cores Disponíveis do Filamento:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {PRODUCT_COLORS.map((col) => {
                const isSelected = selectedColors.includes(col.name);
                return (
                  <Chip
                    key={col.name}
                    label={col.name}
                    avatar={
                      <Box sx={{ ml: 1 }}>
                        <ColorSwatch colorName={col.name} size={16} />
                      </Box>
                    }
                    clickable
                    onClick={() => toggleColor(col.name)}
                    color={isSelected ? "primary" : "default"}
                    variant={isSelected ? "filled" : "outlined"}
                    sx={{ fontWeight: isSelected ? 700 : 400 }}
                  />
                );
              })}
            </Stack>
          </Box>
        </Stack>
      </Dialog.Content>

      <Dialog.Footer>
        <Dialog.FooterActions>
          <Dialog.ActionCancel onClick={() => onClose(false)}>
            Cancelar
          </Dialog.ActionCancel>
          <Dialog.ActionSubmit loading={submitting} onClick={handleSubmit}>
            {isEditing ? "Salvar Alterações" : "Cadastrar Peça"}
          </Dialog.ActionSubmit>
        </Dialog.FooterActions>
      </Dialog.Footer>
    </Dialog.Root>
  );
}
