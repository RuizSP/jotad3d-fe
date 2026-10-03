import { useState } from "react";
import { Box, Stack } from "@mui/material";
import type { Product } from "../../shared/interfaces/Product";
import { getVariantImages } from "../../shared/productImages";

export default function ProductGallery({ product, color, painted, compact = false }: {
  product: Product;
  color: string;
  painted: boolean;
  compact?: boolean;
}) {
  const [selectedUrl, setSelectedUrl] = useState("");
  const images = getVariantImages(product, color, painted);
  const active = images.includes(selectedUrl) ? selectedUrl : images[0];

  return (
    <Stack spacing={1}>
      <Box component="img" src={active} alt={`${product.name} ${painted ? "pintada" : color}`}
        sx={{ width: "100%", height: compact ? { xs: 210, sm: 340 } : { xs: 320, sm: 460 }, objectFit: "cover", borderRadius: 2, bgcolor: "background.paper" }} />
      {images.length > 1 && (
        <Stack direction="row" gap={1} sx={{ overflowX: "auto", pb: 0.5 }}>
          {images.map((url, index) => (
            <Box key={`${url}-${index}`} component="button" type="button" onClick={() => setSelectedUrl(url)}
              aria-label={`Ver imagem ${index + 1} de ${painted ? "Pintada" : color}`}
              sx={{ p: 0, border: "2px solid", borderColor: active === url ? "primary.main" : "divider", borderRadius: 1, cursor: "pointer", flexShrink: 0, overflow: "hidden" }}>
              <Box component="img" src={url} alt="" sx={{ display: "block", width: 64, height: 64, objectFit: "cover" }} />
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
