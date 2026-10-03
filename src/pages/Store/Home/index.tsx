import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import { Search, Sparkles, SlidersHorizontal, ArrowDown } from "lucide-react";
import { Page } from "../../../components/ui/Page";
import ProductCard from "../../../components/ui/ProductCard";
import ProductQuickViewDialog from "../../../components/dialogs/ProductQuickViewDialog";
import CustomQuoteDialog from "../../../components/dialogs/CustomQuoteDialog";
import { useProducts } from "../../../hooks/useProducts";
import type { Product } from "../../../shared/interfaces/Product";
import { Filter } from "../../../components/ui/Filter";
import { useFilter, useFilterApi } from "../../../providers/FilterProvider";
import { useCatalogOptions } from "../../../hooks/useCatalogOptions";
import { useSearchParams } from "react-router-dom";
import { useBranding } from "../../../hooks/useBranding";

export default function Home() {
  return (
    <Filter.Provider initialFormValues={{ category: "Todos" }}>
      <HomeCatalog />
    </Filter.Provider>
  );
}

function HomeCatalog() {
  const { branding } = useBranding();
  const theme = useTheme();
  const { appliedValues } = useFilter<{ category: string }>();
  const { applyFilterValue } = useFilterApi<{ category: string }>();
  const { data: products = [], isPending: loading } = useProducts();
  const { data: catalogCategories = [] } = useCatalogOptions("categories");
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("cat") || appliedValues?.category || "Todos";
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);

  const categories = useMemo(() => {
    return ["Todos", ...catalogCategories.filter((category) => category.active).map((category) => category.name)];
  }, [catalogCategories]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "Todos" || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description &&
          p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <Page.Root>
      <Page.Content>
        <Box
          sx={{
            width: "100%",
            borderRadius: { xs: 3, md: 5 },
            overflow: "hidden",
            position: "relative",
            mb: 6,
            bgcolor: "#0A0A0A",
            color: "#FFFFFF",
            p: { xs: 4, sm: 6, md: 8 },
            border: "1px solid #222222",
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
            background: `radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.23)} 0%, #0A0A0A 70%)`,
          }}
        >
          <Stack spacing={3} maxWidth={720}>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={branding.heroEyebrow}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.secondary.main, 0.2),
                  color: "secondary.main",
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
                  fontWeight: 800,
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                }}
              />
            </Box>

            <Typography
              variant="h2"
              fontWeight="900"
              sx={{
                fontSize: { xs: "2.2rem", sm: "3.2rem", md: "3.8rem" },
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                textTransform: "uppercase",
              }}
            >
              {branding.heroTitle} <br />
              <Box component="span" sx={{ color: "secondary.main" }}>
                {branding.heroHighlight}
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#A0A0A0",
                fontSize: { xs: "1rem", md: "1.15rem" },
                lineHeight: 1.6,
                maxWidth: 580,
              }}
            >
              {branding.heroDescription}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} pt={1}>
              <Button
                variant="contained"
                size="large"
                href="#catalogo"
                endIcon={<ArrowDown size={18} />}
                sx={{
                  bgcolor: "secondary.main",
                  color: "secondary.contrastText",
                  borderRadius: "40px",
                  px: 4,
                  py: 1.5,
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  "&:hover": {
                    bgcolor: "secondary.light",
                  },
                }}
              >
                Explorar Catálogo
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Sparkles size={18} />}
                onClick={() => setQuoteDialogOpen(true)}
                sx={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "#FFFFFF",
                  borderRadius: "40px",
                  px: 3.5,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  "&:hover": {
                    borderColor: "secondary.main",
                    color: "secondary.main",
                    bgcolor: alpha(theme.palette.secondary.main, 0.08),
                  },
                }}
              >
                Solicitar Peça Personalizada
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box id="catalogo" sx={{ mb: 4 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
            mb={3}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight="900"
                sx={{ letterSpacing: "-0.03em" }}
              >
                Catálogo de Peças
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredProducts.length} itens encontrados para produção sob
                demanda
              </Typography>
            </Box>

            <TextField
              size="small"
              placeholder="Buscar por nome ou categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: "100%", md: 320 } }}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              overflowX: "auto",
              pb: 1,
              mb: 4,
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <SlidersHorizontal
              size={18}
              style={{ alignSelf: "center", marginRight: 8, opacity: 0.6 }}
            />
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                clickable
                onClick={() => {
                  applyFilterValue("category", cat);
                  setSearchParams(cat === "Todos" ? {} : { cat });
                }}
                variant={selectedCategory === cat ? "filled" : "outlined"}
                color={selectedCategory === cat ? "primary" : "default"}
                sx={{
                  fontWeight: selectedCategory === cat ? 800 : 500,
                  borderRadius: "30px",
                  px: 1,
                  py: 2,
                }}
              />
            ))}
          </Stack>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress color="secondary" />
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Typography variant="h6" fontWeight="bold">
              Nenhuma peça encontrada no catálogo
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, mb: 3 }}
            >
              Cadastre novas peças através do painel ou envie um modelo 3D para
              orçamento direto no WhatsApp.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setQuoteDialogOpen(true)}
              startIcon={<Sparkles size={18} />}
              sx={{ borderRadius: "40px", px: 3, py: 1.2, fontWeight: 700 }}
            >
              Solicitar Orçamento Personalizado
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3.5}>
            {filteredProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <ProductCard
                  {...product}
                  onQuickView={() => setQuickViewProduct(product)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        <ProductQuickViewDialog
          key={quickViewProduct?.id ?? "closed"}
          product={quickViewProduct}
          open={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
        />

        <CustomQuoteDialog
          open={quoteDialogOpen}
          onClose={() => setQuoteDialogOpen(false)}
        />
      </Page.Content>
    </Page.Root>
  );
}
