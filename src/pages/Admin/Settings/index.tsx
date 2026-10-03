import { useState } from "react";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Page } from "../../../components/ui/Page";
import { useForm } from "../../../hooks/useForm";
import {
  useActiveStoreLocation,
  useSaveStoreLocation,
} from "../../../hooks/useStoreLocation";
import type { StoreLocation } from "../../../shared/interfaces/StoreLocation";
import type { SaveStoreLocationInput } from "../../../services/storeLocations.service";
import StoreLocationAddress from "../../../components/common/StoreLocationAddress";
import BrandingSettings from "./BrandingSettings";

interface StoreLocationFormData {
  name: string;
  addressLine: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  instructions: string;
  whatsapp: string;
}

const storeLocationSchema: Yup.ObjectSchema<StoreLocationFormData> = Yup.object(
  {
    name: Yup.string().trim().required("Informe o nome do local"),
    addressLine: Yup.string().trim().required("Informe a rua"),
    number: Yup.string().trim().required("Informe o número"),
    complement: Yup.string().defined(),
    neighborhood: Yup.string().trim().required("Informe o bairro"),
    city: Yup.string().trim().required("Informe a cidade"),
    state: Yup.string()
      .trim()
      .length(2, "Use a sigla de duas letras")
      .required("Informe o estado"),
    postalCode: Yup.string().trim().required("Informe o CEP"),
    instructions: Yup.string().defined(),
    whatsapp: Yup.string()
      .required("Informe o WhatsApp da empresa")
      .test(
        "phone-length",
        "Informe o número com código do país e DDD (10 a 15 dígitos)",
        (value) => /^\d{10,15}$/.test((value ?? "").replace(/\D/g, "")),
      ),
  },
);

const toFormData = (location: StoreLocation | null): StoreLocationFormData => ({
  name: location?.name ?? "",
  addressLine: location?.addressLine ?? "",
  number: location?.number ?? "",
  complement: location?.complement ?? "",
  neighborhood: location?.neighborhood ?? "",
  city: location?.city ?? "",
  state: location?.state ?? "",
  postalCode: location?.postalCode ?? "",
  instructions: location?.instructions ?? "",
  whatsapp: location?.whatsapp ?? "",
});

export default function StoreLocationSettings() {
  const locationQuery = useActiveStoreLocation();

  return (
    <Page.Root>
      <Page.Header>
        <Page.Title
          links={[
            { title: "Painel", path: "/admin/dashboard" },
            { title: "Configurações" },
          ]}
        />
      </Page.Header>
      <Page.Content>
        <Box maxWidth={760} width="100%" mx="auto" display="grid" gap={3}>
          <BrandingSettings />
          {locationQuery.isPending ? (
            <Box display="flex" justifyContent="center" py={5}><CircularProgress /></Box>
          ) : locationQuery.error ? (
            <Alert severity="error">Não foi possível carregar o contato e endereço da loja.</Alert>
          ) : (
            <StoreLocationForm
              key={locationQuery.data?.id ?? "new-store-location"}
              location={locationQuery.data ?? null}
            />
          )}
        </Box>
      </Page.Content>
    </Page.Root>
  );
}

function StoreLocationForm({ location }: { location: StoreLocation | null }) {
  const [formError, setFormError] = useState("");
  const saveLocation = useSaveStoreLocation();
  const { data, changeValue, validation, validationErrors } =
    useForm<StoreLocationFormData>({
      initialValues: toFormData(location),
      schema: storeLocationSchema,
    });

  const handleSubmit = async () => {
    setFormError("");
    if (!(await validation())) return;

    try {
      const input: SaveStoreLocationInput = {
        ...data,
        id: location?.id,
      };
      await saveLocation.mutateAsync(input);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o endereço.",
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
            Contato e endereço da loja
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            O WhatsApp recebe pedidos e orçamentos. O endereço será exibido aos
            clientes que escolherem retirar o pedido.
          </Typography>
        </Box>

        {location && (
          <Alert severity="info">
            Alterar o endereço atualiza o local exibido nos pedidos de retirada.
          </Alert>
        )}
        {formError && <Alert severity="error">{formError}</Alert>}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="WhatsApp da empresa"
              type="tel"
              placeholder="5511999999999"
              value={data.whatsapp}
              onChange={(event) => changeValue("whatsapp", event.target.value)}
              {...validationErrors("whatsapp")}
              helperText={
                validationErrors("whatsapp").error
                  ? validationErrors("whatsapp").helperText
                  : "Inclua o código do país e o DDD. Ex.: 55 11 99999-9999"
              }
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Nome do local"
              value={data.name}
              onChange={(event) => changeValue("name", event.target.value)}
              {...validationErrors("name")}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              label="Rua / Avenida"
              value={data.addressLine}
              onChange={(event) =>
                changeValue("addressLine", event.target.value)
              }
              {...validationErrors("addressLine")}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Número"
              value={data.number}
              onChange={(event) => changeValue("number", event.target.value)}
              {...validationErrors("number")}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Complemento (opcional)"
              value={data.complement}
              onChange={(event) =>
                changeValue("complement", event.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Bairro"
              value={data.neighborhood}
              onChange={(event) =>
                changeValue("neighborhood", event.target.value)
              }
              {...validationErrors("neighborhood")}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Cidade"
              value={data.city}
              onChange={(event) => changeValue("city", event.target.value)}
              {...validationErrors("city")}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Estado (UF)"
              inputProps={{ maxLength: 2 }}
              value={data.state}
              onChange={(event) =>
                changeValue("state", event.target.value.toUpperCase())
              }
              {...validationErrors("state")}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              label="CEP"
              value={data.postalCode}
              onChange={(event) =>
                changeValue("postalCode", event.target.value)
              }
              {...validationErrors("postalCode")}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Instruções para retirada (opcional)"
              value={data.instructions}
              onChange={(event) =>
                changeValue("instructions", event.target.value)
              }
              multiline
              minRows={2}
              fullWidth
            />
          </Grid>
        </Grid>

        {data.name && data.addressLine && data.city && (
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              textTransform="uppercase"
              fontWeight={700}
            >
              Prévia do endereço
            </Typography>
            <Paper variant="outlined" sx={{ mt: 0.75, p: 1.5 }}>
              <StoreLocationAddress
                location={{
                  id: location?.id ?? "preview",
                  ...data,
                  complement: data.complement || null,
                  instructions: data.instructions || null,
                }}
              />
            </Paper>
          </Box>
        )}

        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saveLocation.isPending}
            startIcon={
              saveLocation.isPending ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {location ? "Salvar configurações" : "Cadastrar loja"}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
