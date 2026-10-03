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
  Button,
  IconButton,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type { DialogProps } from "@toolpad/core";
import { Dialog } from "../ui/Dialog";
import { useForm } from "../../hooks/useForm";
import { useCreateProduct, useUpdateProduct } from "../../hooks/useProducts";
import type { Product } from "../../shared/interfaces/Product";
import ColorSwatch from "../common/ColorSwatch";
import { productImagesService } from "../../services/productImages.service";
import { useCatalogOptions } from "../../hooks/useCatalogOptions";

interface ProductFormData {
  name: string;
  category: string;
  price: number | string;
  paintingPrice: number | string;
  material: string;
  dimensions: string;
  printTimeHours: number | string;
  description: string;
}

type PendingImage = { id: string; url: string; file?: File };
type ImageGroups = Record<string, PendingImage[]>;

const existingGroups = (product?: Product | null): ImageGroups => {
  const groups = Object.fromEntries(
    Object.entries(product?.imagesByVariant || {}).map(([key, urls]) => [
      key,
      urls.map((url) => ({ id: crypto.randomUUID(), url })),
    ]),
  );
  if (product?.imageUrl && !Object.values(groups).flat().some((image) => image.url === product.imageUrl)) {
    const color = product.availableColors?.[0] || "Preto";
    groups[color] = [{ id: crypto.randomUUID(), url: product.imageUrl }, ...(groups[color] || [])];
  }
  return groups;
};

const productValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Informe o nome da peça")
    .min(3, "Mínimo 3 caracteres"),
  category: Yup.string().required("Selecione a categoria"),
  price: Yup.number()
    .typeError("Preço inválido")
    .positive("Deve ser maior que zero")
    .required("Informe o preço"),
  paintingPrice: Yup.number()
    .transform((value, originalValue) => originalValue === "" ? null : value)
    .nullable()
    .typeError("Preço de pintura inválido")
    .min(0, "Não pode ser negativo"),
  material: Yup.string().required("Selecione o material"),
  dimensions: Yup.string(),
  printTimeHours: Yup.number()
    .transform((value, originalValue) => originalValue === "" ? null : value)
    .nullable()
    .typeError("Tempo inválido")
    .min(0, "Não pode ser negativo"),
  description: Yup.string(),
});

export default function ProductFormDialog({
  open,
  onClose,
  payload,
}: DialogProps<Product | null, boolean>) {
  const isEditing = Boolean(payload && payload.id);
  const [selectedColors, setSelectedColors] = useState<string[]>(
    payload?.availableColors || [],
  );
  const { data: categories = [], error: categoriesError } = useCatalogOptions("categories");
  const { data: colors = [], error: colorsError } = useCatalogOptions("colors");
  const { data: materials = [], error: materialsError } = useCatalogOptions("materials");
  const [images, setImages] = useState<ImageGroups>(() => existingGroups(payload));
  const [uploading, setUploading] = useState(false);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const submitting = uploading || createProduct.isPending || updateProduct.isPending;
  const submissionInProgress = useRef(false);

  const { data, changeValue, validation, validationErrors, setData } =
    useForm<ProductFormData>({
      initialValues: {
        name: payload?.name || "",
        category: payload?.category || "",
        price: payload?.price || "",
        paintingPrice: payload?.paintingPrice ?? "",
        material: payload?.material || "",
        dimensions: payload?.dimensions || "",
        printTimeHours: payload?.printTimeHours || "",
        description: payload?.description || "",
      },
      schema: productValidationSchema,
    });

  useEffect(() => {
    if (payload) {
      setData({
        name: payload.name || "",
        category: payload.category || "",
        price: payload.price ?? "",
        paintingPrice: payload.paintingPrice ?? "",
        material: payload.material || "",
        dimensions: payload.dimensions || "",
        printTimeHours: payload.printTimeHours ?? "",
        description: payload.description || "",
      });
      setSelectedColors(
        payload.availableColors || [],
      );
      setImages(existingGroups(payload));
    }
  }, [payload, setData]);

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName],
    );
  };

  const addImages = (variant: string, files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024);
    if (valid.length !== files.length) toast.error("Use imagens de até 10 MB.");
    setImages((current) => ({
      ...current,
      [variant]: [
        ...(current[variant] || []),
        ...valid.map((file) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(file), file })),
      ],
    }));
  };

  const removeImage = (variant: string, id: string) => {
    setImages((current) => ({
      ...current,
      [variant]: (current[variant] || []).filter((image) => image.id !== id),
    }));
  };

  const handleSubmit = async () => {
    if (submissionInProgress.current) return;

    submissionInProgress.current = true;
    try {
      const isValid = await validation();
      if (!isValid) return;
      if (categoriesError || colorsError || materialsError) {
        toast.error("Não foi possível carregar as opções do catálogo.");
        return;
      }
      const variants = [...selectedColors, "Pintada"];
      if (!variants.some((variant) => images[variant]?.length)) {
        toast.error("Adicione pelo menos uma imagem.");
        return;
      }

      setUploading(true);
      const uploadedPaths: string[] = [];
      let saved = false;
      try {
        const productId = payload?.id || crypto.randomUUID();
        const imagesByVariant: Record<string, string[]> = {};
        for (const variant of variants) {
          imagesByVariant[variant] = [];
          for (const image of images[variant] || []) {
            if (image.file) {
              const uploaded = await productImagesService.upload(image.file, productId);
              uploadedPaths.push(uploaded.path);
              imagesByVariant[variant].push(uploaded.url);
            } else {
              imagesByVariant[variant].push(image.url);
            }
          }
        }
        const imageUrl = variants.flatMap((variant) => imagesByVariant[variant])[0];

      const productPayload = {
        name: data.name,
        category: data.category,
        price: Number(data.price),
        paintingPrice:
          data.paintingPrice === "" ? null : Number(data.paintingPrice),
        material: data.material,
        dimensions: data.dimensions || undefined,
        printTimeHours:
          data.printTimeHours === "" ? null : Number(data.printTimeHours),
        description: data.description,
        imageUrl,
        imagesByVariant,
        availableColors:
          selectedColors,
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
      saved = true;
      if (payload?.id) {
        const kept = new Set(Object.values(imagesByVariant).flat());
        const removedPaths = Object.values(payload.imagesByVariant || {})
          .flat()
          .filter((url) => !kept.has(url))
          .map((url) => productImagesService.pathFromUrl(url, payload.id))
          .filter((path): path is string => Boolean(path));
        await productImagesService.remove(removedPaths).catch(console.error);
      }
      await onClose(true);
      } catch (error) {
        if (!saved) await productImagesService.remove(uploadedPaths).catch(console.error);
        toast.error(error instanceof Error ? error.message : "Não foi possível salvar as imagens.");
      } finally {
        setUploading(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o produto.");
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
                {[...categories.filter((option) => option.active), ...(data.category && !categories.some((option) => option.name === data.category && option.active) ? [{ id: "current", name: data.category }] : [])].map((cat) => (
                  <MenuItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Preço Base (R$) *"
                type="number"
                placeholder="49.90"
                value={data.price}
                onChange={(e) => changeValue("price", e.target.value)}
                {...validationErrors("price")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Adicional de Pintura (R$)"
                type="number"
                value={data.paintingPrice}
                onChange={(e) => changeValue("paintingPrice", e.target.value)}
                {...validationErrors("paintingPrice")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                select
                label="Material / Filamento"
                value={data.material}
                onChange={(e) => changeValue("material", e.target.value)}
              >
                {[...materials.filter((option) => option.active), ...(data.material && !materials.some((option) => option.name === data.material && option.active) ? [{ id: "current", name: data.material }] : [])].map((mat) => (
                  <MenuItem key={mat.id} value={mat.name}>
                    {mat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Tempo Est. (horas)"
                type="number"
                placeholder="6"
                value={data.printTimeHours}
                onChange={(e) => changeValue("printTimeHours", e.target.value)}
                {...validationErrors("printTimeHours")}
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
              {[...colors.filter((option) => option.active), ...selectedColors.filter((name) => !colors.some((option) => option.name === name && option.active)).map((name) => ({ id: name, name }))].map((col) => {
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
          <Stack spacing={2}>
            <Typography variant="subtitle2">Imagens por variação</Typography>
            {[...selectedColors, "Pintada"].map((variant) => (
              <Box key={variant} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography fontWeight={700}>{variant}</Typography>
                  <Button component="label" size="small" variant="outlined">
                    Enviar imagens
                    <input hidden type="file" accept="image/*" multiple onChange={(event) => { addImages(variant, event.target.files); event.target.value = ""; }} />
                  </Button>
                </Stack>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {(images[variant] || []).map((image) => (
                    <Box key={image.id} sx={{ position: "relative" }}>
                      <Box component="img" src={image.url} alt={variant} sx={{ width: 88, height: 88, objectFit: "cover", borderRadius: 1 }} />
                      <IconButton size="small" aria-label={`Remover imagem de ${variant}`} onClick={() => removeImage(variant, image.id)} sx={{ position: "absolute", right: 0, top: 0, bgcolor: "background.paper" }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
            ))}
            <Typography variant="caption" color="text.secondary">A primeira imagem será a capa do catálogo. Use imagens de até 10 MB.</Typography>
          </Stack>
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
