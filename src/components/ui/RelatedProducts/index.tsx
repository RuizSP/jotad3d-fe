import { useMemo } from "react";
import { Box, Typography, Grid, Stack, Button } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { useProducts } from "../../../hooks/useProducts";

export default function RelatedProducts({
  currentCategory,
}: {
  currentCategory?: string;
}) {
  const { data: allProducts = [] } = useProducts();
  const products = useMemo(() => {
    const filtered = currentCategory
      ? allProducts.filter((product) => product.category === currentCategory)
      : allProducts;
    return filtered.slice(0, 4);
  }, [allProducts, currentCategory]);

  if (products.length === 0) return null;

  return (
    <Box sx={{ mt: 8, mb: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h5"
          fontWeight="900"
          sx={{ letterSpacing: "-0.02em" }}
        >
          Outras Peças em Destaque
        </Typography>
        <Button
          component={Link}
          to="/"
          endIcon={<ArrowRight size={16} />}
          sx={{ fontWeight: 700 }}
        >
          Ver Catálogo
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
            <ProductCard {...product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
