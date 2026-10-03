import { useState } from "react";
import { Box, Dialog, IconButton, Stack, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { Product } from "../../shared/interfaces/Product";
import { getVariantImages } from "../../shared/productImages";

export default function ProductGallery({ product, color, painted, compact = false }: {
  product: Product;
  color: string;
  painted: boolean;
  compact?: boolean;
}) {
  const [selectedUrl, setSelectedUrl] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const images = getVariantImages(product, color, painted);
  const active = images.includes(selectedUrl) ? selectedUrl : images[0];
  const activeIndex = images.indexOf(active);
  const variantLabel = painted ? "pintada" : color;
  const showImage = (index: number) => {
    setSelectedUrl(images[(index + images.length) % images.length]);
  };

  return (
    <Stack spacing={1}>
      <Box component="button" type="button" onClick={() => setFullscreen(true)}
        aria-label={`Ampliar imagem de ${product.name} ${variantLabel}`}
        sx={{ position: "relative", display: "block", width: "100%", p: 0, border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden", bgcolor: "background.paper", cursor: "zoom-in" }}>
        <Box component="img" src={active} alt={`${product.name} ${variantLabel}`}
          sx={{ display: "block", width: "100%", height: compact ? { xs: 210, sm: 340 } : { xs: 320, sm: 460 }, objectFit: "contain" }} />
        <Expand size={20} aria-hidden="true" style={{ position: "absolute", right: 12, bottom: 12 }} />
      </Box>
      {images.length > 1 && (
        <Stack direction="row" gap={1} sx={{ overflowX: "auto", pb: 0.5 }}>
          {images.map((url, index) => (
            <Box key={`${url}-${index}`} component="button" type="button" onClick={() => showImage(index)}
              aria-label={`Ver imagem ${index + 1} de ${painted ? "Pintada" : color}`}
              sx={{ p: 0, border: "2px solid", borderColor: active === url ? "primary.main" : "divider", borderRadius: 1, cursor: "pointer", flexShrink: 0, overflow: "hidden", bgcolor: "background.paper" }}>
              <Box component="img" src={url} alt="" sx={{ display: "block", width: 64, height: 64, objectFit: "contain" }} />
            </Box>
          ))}
        </Stack>
      )}
      <Dialog open={fullscreen} onClose={() => setFullscreen(false)} fullScreen
        aria-label={`Imagem ampliada de ${product.name} ${variantLabel}`}
        slotProps={{ paper: { sx: { bgcolor: "#111", color: "#fff" } } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1 }}>
          <Typography variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.name} · {variantLabel} {images.length > 1 && `· ${activeIndex + 1}/${images.length}`}
          </Typography>
          <IconButton onClick={() => setFullscreen(false)} aria-label="Fechar imagem ampliada" sx={{ color: "inherit" }}><X /></IconButton>
        </Box>
        <Box sx={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", px: { xs: 1, sm: 7 }, pb: 2 }}>
          <Box component="img" src={active} alt={`${product.name} ${variantLabel}`}
            sx={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain" }} />
          {images.length > 1 && (
            <>
              <IconButton onClick={() => showImage(activeIndex - 1)} aria-label="Imagem anterior" sx={{ position: "absolute", left: { xs: 4, sm: 16 }, top: "50%", color: "#fff", bgcolor: "#0009" }}><ChevronLeft /></IconButton>
              <IconButton onClick={() => showImage(activeIndex + 1)} aria-label="Próxima imagem" sx={{ position: "absolute", right: { xs: 4, sm: 16 }, top: "50%", color: "#fff", bgcolor: "#0009" }}><ChevronRight /></IconButton>
            </>
          )}
        </Box>
      </Dialog>
    </Stack>
  );
}
