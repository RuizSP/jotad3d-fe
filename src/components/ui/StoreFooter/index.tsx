import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import BrandIdentity from "../../common/BrandIdentity";
import { useActiveStoreLocation } from "../../../hooks/useStoreLocation";
import { useBranding } from "../../../hooks/useBranding";
import { useCatalogOptions } from "../../../hooks/useCatalogOptions";

export default function StoreFooter() {
  const { branding } = useBranding();
  const { data: storeLocation } = useActiveStoreLocation();
  const { data: materials = [] } = useCatalogOptions("materials");
  const phone = (storeLocation?.whatsapp ?? "").replace(/\D/g, "");

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        pt: 7,
        pb: 4,
        borderTop: "1px solid",
        borderColor: "divider",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box mb={2}>
              <BrandIdentity />
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 360, mb: 3, lineHeight: 1.7 }}
            >
              {branding.tagline}
            </Typography>
            {phone && (
              <Button
                variant="outlined"
                color="secondary"
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<MessageCircle size={18} />}
                endIcon={<ArrowUpRight size={16} />}
              >
                Falar no WhatsApp
              </Button>
            )}
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={2}>
              Navegação
            </Typography>
            <Stack spacing={1.5}>
              {[
                ["Catálogo", "/"],
                ["Acompanhar pedido", "/tracking"],
                ["Finalizar compra", "/checkout"],
              ].map(([label, path]) => (
                <Typography
                  key={path}
                  variant="body2"
                  component={Link}
                  to={path}
                  sx={{
                    color: "text.secondary",
                    textDecoration: "none",
                    "&:hover": { color: "secondary.main" },
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={2}>
              Materiais
            </Typography>
            <Stack spacing={1.5}>
              {materials
                .filter((material) => material.active)
                .slice(0, 4)
                .map((material) => (
                  <Typography
                    key={material.id}
                    variant="body2"
                    color="text.secondary"
                  >
                    {material.name}
                  </Typography>
                ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={2}>
              Sobre a loja
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              {branding.heroDescription}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
        <Typography variant="caption" color="text.secondary">
          &copy; {new Date().getFullYear()} {branding.companyName}. Todos os
          direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
}
