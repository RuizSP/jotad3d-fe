import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import { Box as BoxIcon, MessageCircle, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useActiveStoreLocation } from "../../../hooks/useStoreLocation";

export default function StoreFooter() {
  const { data: storeLocation } = useActiveStoreLocation();
  const companyPhone = storeLocation?.whatsapp ?? "";
  const cleanPhone = companyPhone.replace(/\D/g, "");

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0A0A0A",
        color: "#F5F5F5",
        pt: 8,
        pb: 5,
        borderTop: "1px solid #222222",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box display="flex" alignItems="center" gap={1.2} mb={2}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  bgcolor: "#161616",
                  color: "#D4AF37",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #D4AF37",
                }}
              >
                <BoxIcon size={18} />
              </Box>
              <Typography variant="h6" fontWeight="900" sx={{ letterSpacing: "-0.02em", color: "#F5F5F5" }}>
                JOTAD<Box component="span" sx={{ color: "#D4AF37" }}>3D</Box>
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: "#A0A0A0", maxWidth: 360, mb: 3, lineHeight: 1.7 }}>
              Soluções sob medida em impressão 3D FDM & Resina. Decoração,
              colecionáveis, prototipagem rápida e engenharia de precisão com acabamento premium.
            </Typography>

            {cleanPhone && <Button
              variant="outlined"
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<MessageCircle size={18} />}
              endIcon={<ArrowUpRight size={16} />}
              sx={{
                borderColor: "#D4AF37",
                color: "#D4AF37",
                borderRadius: "40px",
                px: 2.5,
                py: 1,
                fontWeight: 700,
                "&:hover": {
                  bgcolor: "rgba(212,175,55,0.1)",
                  borderColor: "#E8C766",
                },
              }}
            >
              Falar no WhatsApp
            </Button>}
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle2" fontWeight="700" sx={{ color: "#FFFFFF", mb: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Navegação
            </Typography>
            <Stack spacing={1.5}>
              <Typography
                variant="body2"
                component={Link}
                to="/"
                sx={{ color: "#A0A0A0", textDecoration: "none", "&:hover": { color: "#D4AF37" } }}
              >
                Catálogo
              </Typography>
              <Typography
                variant="body2"
                component={Link}
                to="/tracking"
                sx={{ color: "#A0A0A0", textDecoration: "none", "&:hover": { color: "#D4AF37" } }}
              >
                Acompanhar Pedido
              </Typography>
              <Typography
                variant="body2"
                component={Link}
                to="/checkout"
                sx={{ color: "#A0A0A0", textDecoration: "none", "&:hover": { color: "#D4AF37" } }}
              >
                Finalizar Compra
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle2" fontWeight="700" sx={{ color: "#FFFFFF", mb: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Filamentos
            </Typography>
            <Stack spacing={1.5}>
              <Typography variant="body2" sx={{ color: "#A0A0A0" }}>
                PLA Silk & Matte
              </Typography>
              <Typography variant="body2" sx={{ color: "#A0A0A0" }}>
                PETG Técnico
              </Typography>
              <Typography variant="body2" sx={{ color: "#A0A0A0" }}>
                PLA Duocolor
              </Typography>
              <Typography variant="body2" sx={{ color: "#A0A0A0" }}>
                ABS Reforçado
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Typography variant="subtitle2" fontWeight="700" sx={{ color: "#FFFFFF", mb: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Processo de Produção
            </Typography>
            <Typography variant="body2" sx={{ color: "#A0A0A0", lineHeight: 1.6, mb: 1.5 }}>
              Todas as peças são impressas sob demanda com controle de temperatura, altura de camada precisa e inspeção manual de acabamento.
            </Typography>
            <Typography variant="caption" sx={{ color: "#D4AF37", fontWeight: 700 }}>
              Garantia de precisão e durabilidade.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "#222222" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: "#777777" }}>
            &copy; {new Date().getFullYear()} JOTAD3D. Todos os direitos reservados.
          </Typography>
          <Typography variant="caption" sx={{ color: "#777777" }}>
            Impressão 3D Profissional & Prototipagem
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
