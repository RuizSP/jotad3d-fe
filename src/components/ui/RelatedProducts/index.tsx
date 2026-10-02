import { useState, useEffect } from "react";
import { Box, Typography, Grid, Stack, Button } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { productsService } from "../../../services/products.service";
import type { Product } from "../../../shared/interfaces/Product";

export default function RelatedProducts({
  currentCategory,
}: {
  currentCategory?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    productsService.getAll().then((list) => {
      const filtered = currentCategory
        ? list.filter((p) => p.category === currentCategory)
        : list;
      setProducts(filtered.slice(0, 4));
    });
  }, [currentCategory]);

  if (products.length === 0) return null;

  return (
    <Box sx={{ mt: 8, mb: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: "-0.02em" }}>
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
