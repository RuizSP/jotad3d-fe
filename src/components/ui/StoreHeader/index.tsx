import { useState } from "react";
import {
  Badge,
  Box,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
import { ShoppingBag, Search, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../Header";
import BrandIdentity from "../../common/BrandIdentity";
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
            <BrandIdentity />
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

        </Stack>
      </Header.Root>

      <CustomQuoteDialog
        open={quoteDialogOpen}
        onClose={() => setQuoteDialogOpen(false)}
      />
    </>
  );
}
