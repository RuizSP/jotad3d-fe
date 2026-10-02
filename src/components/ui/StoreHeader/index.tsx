import { useState } from "react";
import {
  Badge,
  Box,
  IconButton,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import { ShoppingBag, Box as BoxIcon, Search, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../Header";
import ThemeSwitch from "../ThemeSwitch";
import { useCart } from "../../../providers/CartContext";
import CustomQuoteDialog from "../../dialogs/CustomQuoteDialog";

export default function StoreHeader() {
  const { totalItems, toggleCartDrawer } = useCart();
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Header.Root>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              textDecoration: "none",
              color: "text.primary",
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: "#0A0A0A",
                color: "#D4AF37",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #D4AF37",
              }}
            >
              <BoxIcon size={20} />
            </Box>
            <Typography
              variant="h6"
              fontWeight="900"
              sx={{
                letterSpacing: "-0.03em",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              JOTAD
              <Box component="span" sx={{ color: "secondary.main" }}>
                3D
              </Box>
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{ fontWeight: 600, fontSize: "0.875rem" }}
            >
              Catálogo
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/tracking"
              startIcon={<Search size={16} />}
              sx={{ fontWeight: 600, fontSize: "0.875rem" }}
            >
              Acompanhar Pedido
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Sparkles size={16} />}
              onClick={() => setQuoteDialogOpen(true)}
              sx={{
                fontWeight: 700,
                fontSize: "0.85rem",
                borderRadius: "30px",
                borderWidth: "1.5px",
              }}
            >
              Peça Personalizada
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            size="small"
            color="secondary"
            variant="text"
            onClick={() => navigate("/tracking")}
            sx={{ display: { xs: "flex", md: "none" }, fontWeight: 700 }}
          >
            Rastrear
          </Button>

          <IconButton
            color="inherit"
            onClick={toggleCartDrawer}
            aria-label="carrinho"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "50%",
              p: 1.2,
            }}
          >
            <Badge badgeContent={totalItems} color="secondary">
              <ShoppingBag size={20} />
            </Badge>
          </IconButton>

          <ThemeSwitch />
        </Stack>
      </Header.Root>

      <CustomQuoteDialog
        open={quoteDialogOpen}
        onClose={() => setQuoteDialogOpen(false)}
      />
    </>
  );
}
