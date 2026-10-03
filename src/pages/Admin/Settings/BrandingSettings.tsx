import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { brandingService } from "../../../services/branding.service";
import { useBranding, useSaveBranding } from "../../../hooks/useBranding";
import type { Branding } from "../../../shared/interfaces/Branding";

export default function BrandingSettings() {
  const { branding, isPending, error } = useBranding();

  if (isPending)
    return (
      <Box display="flex" justifyContent="center" py={5}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error">
        Não foi possível carregar a identidade da loja. Confira se a migração 13
        foi aplicada.
      </Alert>
    );

  return (
    <BrandingForm
      key={`${branding.companyName}-${branding.logoUrl}`}
      initial={branding}
    />
  );
}

function BrandingForm({ initial }: { initial: Branding }) {
  const [data, setData] = useState(initial);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");
  const save = useSaveBranding();

  const change = <K extends keyof Branding>(key: K, value: Branding[K]) => {
    setData((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    setFormError("");
    if (
      data.companyName.trim().length < 2 ||
      data.companyName.trim().length > 80
    ) {
      setFormError("Informe um nome de 2 a 80 caracteres.");
      return;
    }
    if (
      !data.heroTitle.trim() ||
      !data.heroHighlight.trim() ||
      !data.heroDescription.trim()
    ) {
      setFormError(
        "Preencha o título e a descrição do destaque da página inicial.",
      );
      return;
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(data.accentColor)) {
      setFormError("Informe a cor no formato #RRGGBB.");
      return;
    }
    try {
      const logoUrl = logoFile
        ? await brandingService.uploadLogo(logoFile)
        : data.logoUrl;
      await save.mutateAsync({ ...data, logoUrl });
      setLogoFile(null);
    } catch (saveError) {
      setFormError(
        saveError instanceof Error
          ? saveError.message
          : "Não foi possível salvar a identidade.",
      );
    }
  };

  return (
    <Paper
      component="section"
      variant="outlined"
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h6" fontWeight={800}>
            Identidade da empresa
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Estas informações aparecem para todos os clientes nesta instalação.
          </Typography>
        </Box>

        {formError && <Alert severity="error">{formError}</Alert>}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Nome da empresa"
              value={data.companyName}
              onChange={(event) => change("companyName", event.target.value)}
              inputProps={{ maxLength: 80 }}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Frase curta da empresa"
              value={data.tagline}
              onChange={(event) => change("tagline", event.target.value)}
              inputProps={{ maxLength: 160 }}
              helperText="Exibida no rodapé e na descrição da aba."
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ sm: "center" }}
            >
              {data.logoUrl && (
                <Box
                  component="img"
                  src={data.logoUrl}
                  alt="Logo atual"
                  sx={{ width: 72, height: 72, objectFit: "contain" }}
                />
              )}
              <Button component="label" variant="outlined">
                {logoFile ? logoFile.name : "Escolher logo"}
                <input
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) =>
                    setLogoFile(event.target.files?.[0] ?? null)
                  }
                />
              </Button>
              {data.logoUrl && (
                <Button
                  color="error"
                  onClick={() => {
                    change("logoUrl", null);
                    setLogoFile(null);
                  }}
                >
                  Remover logo
                </Button>
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              PNG, JPEG ou WebP de até 2 MB. O logo também será usado como ícone
              da aba.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="Tema da loja"
              value={data.themeName}
              onChange={(event) =>
                change("themeName", event.target.value as Branding["themeName"])
              }
            >
              <MenuItem value="elegantGold">Claro</MenuItem>
              <MenuItem value="darkElegance">Escuro</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Cor de destaque"
                value={data.accentColor}
                onChange={(event) => change("accentColor", event.target.value)}
                inputProps={{ maxLength: 7 }}
                helperText="Formato #RRGGBB"
              />
              <Box
                component="input"
                type="color"
                aria-label="Escolher cor de destaque"
                value={
                  /^#[0-9A-Fa-f]{6}$/.test(data.accentColor)
                    ? data.accentColor
                    : "#D4AF37"
                }
                onChange={(event) => change("accentColor", event.target.value)}
                sx={{
                  width: 44,
                  height: 38,
                  border: 0,
                  p: 0,
                  cursor: "pointer",
                }}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" fontWeight={800}>
              Destaque da página inicial
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Etiqueta acima do título"
              value={data.heroEyebrow}
              onChange={(event) => change("heroEyebrow", event.target.value)}
              inputProps={{ maxLength: 80 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Título"
              value={data.heroTitle}
              onChange={(event) => change("heroTitle", event.target.value)}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Trecho em destaque"
              value={data.heroHighlight}
              onChange={(event) => change("heroHighlight", event.target.value)}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Descrição"
              value={data.heroDescription}
              onChange={(event) =>
                change("heroDescription", event.target.value)
              }
              inputProps={{ maxLength: 300 }}
              multiline
              minRows={2}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" fontWeight={800}>
              Texto dos orçamentos
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Forma de pagamento"
              value={data.quotePaymentText}
              onChange={(event) =>
                change("quotePaymentText", event.target.value)
              }
              inputProps={{ maxLength: 160 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Entrega e retirada"
              value={data.quoteDeliveryText}
              onChange={(event) =>
                change("quoteDeliveryText", event.target.value)
              }
              inputProps={{ maxLength: 160 }}
            />
          </Grid>
        </Grid>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Prévia do destaque
          </Typography>
          <Paper
            variant="outlined"
            sx={{ mt: 0.75, p: 2.5, bgcolor: "#0A0A0A", color: "#FFFFFF" }}
          >
            <Typography
              variant="caption"
              fontWeight={800}
              sx={{ color: data.accentColor }}
            >
              {data.heroEyebrow}
            </Typography>
            <Typography variant="h5" fontWeight={900}>
              {data.heroTitle}{" "}
              <Box component="span" sx={{ color: data.accentColor }}>
                {data.heroHighlight}
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.75 }}>
              {data.heroDescription}
            </Typography>
          </Paper>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={save.isPending}
            startIcon={
              save.isPending ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            Salvar identidade
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
