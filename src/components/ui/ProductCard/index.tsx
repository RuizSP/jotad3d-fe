import {
  Box,
  Typography,
  Button,
  Stack,
  useTheme,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "../../../providers/CartContext";
import { motion } from "framer-motion";
import ColorSwatch from "../../common/ColorSwatch";

export interface ProductProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  availableColors?: string[];
  dimensions?: string;
  onQuickView?: () => void;
}

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  category,
  availableColors = ["Preto", "Branco", "Dourado"],
  onQuickView,
}: ProductProps) {
  const theme = useTheme();
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      price,
      quantity: 1,
      imageUrl,
      color: availableColors[0] || "Preto",
    });
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={{ height: "100%" }}
    >
      <Card
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: theme.shadows[1],
          border: "1px solid",
          borderColor: "divider",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 24px -10px rgba(0,0,0,0.15)",
            borderColor: "secondary.main",
          },
          display: "flex",
          flexDirection: "column",
          height: "100%",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            position: "relative",
            paddingTop: "95%",
            overflow: "hidden",
            bgcolor: "background.default",
          }}
        >
          <CardMedia
            component="img"
            image={imageUrl}
            alt={name}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              "&:hover": {
                transform: "scale(1.06)",
              },
            }}
          />

          <Chip
            label={category}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              fontWeight: 700,
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              bgcolor: "rgba(10, 10, 10, 0.75)",
              color: "#FFFFFF",
              backdropFilter: "blur(6px)",
            }}
          />

          {onQuickView && (
            <Button
              size="small"
              variant="contained"
              startIcon={<Eye size={14} />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView();
              }}
              sx={{
                position: "absolute",
                bottom: 12,
                right: 12,
                borderRadius: "20px",
                fontSize: "0.75rem",
                py: 0.5,
                px: 1.5,
                bgcolor: "rgba(10,10,10,0.8)",
                color: "#FFFFFF",
                backdropFilter: "blur(6px)",
                "&:hover": {
                  bgcolor: "secondary.main",
                  color: "#0A0A0A",
                },
              }}
            >
              Espiar
            </Button>
          )}
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            p: 2.5,
          }}
        >
          <Stack direction="row" spacing={0.8} sx={{ mb: 1.5 }}>
            {availableColors.slice(0, 4).map((c) => (
              <ColorSwatch key={c} colorName={c} size={14} />
            ))}
            {availableColors.length > 4 && (
              <Typography variant="caption" color="text.secondary">
                +{availableColors.length - 4}
              </Typography>
            )}
          </Stack>

          <Typography
            variant="subtitle1"
            fontWeight="700"
            sx={{
              mb: 1,
              flexGrow: 1,
              textDecoration: "none",
              color: "text.primary",
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
            }}
            component={Link}
            to={`/product/${id}`}
          >
            {name}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
          >
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                A partir de
              </Typography>
              <Typography
                variant="h6"
                color="secondary.main"
                fontWeight="800"
                sx={{ letterSpacing: "-0.02em" }}
              >
                R$ {price.toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleAddToCart}
              startIcon={<ShoppingCart size={16} />}
              sx={{
                borderRadius: "30px",
                px: 2,
                py: 0.8,
                fontWeight: 700,
              }}
            >
              Comprar
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}
