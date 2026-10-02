import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Button,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../../providers/CartContext";
import ColorSwatch from "../../common/ColorSwatch";

export default function CartDrawer() {
  const {
    isCartDrawerOpen,
    closeCartDrawer,
    items,
    updateQuantity,
    removeItem,
    totalPrice,
    totalItems,
  } = useCart();

  const getItemCompositeKey = (item: { id: string; color?: string }) =>
    `${item.id}__${item.color || "padrao"}`;

  return (
    <Drawer
      anchor="right"
      open={isCartDrawerOpen}
      onClose={closeCartDrawer}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 },
          p: 3,
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <ShoppingBag size={22} />
          <Typography variant="h6" fontWeight="800">
            Seu Carrinho
          </Typography>
          <Chip
            label={`${totalItems} itens`}
            size="small"
            sx={{ fontWeight: 700, fontSize: "0.75rem" }}
          />
        </Box>
        <IconButton onClick={closeCartDrawer} edge="end" size="small">
          <X size={20} />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          pr: 0.5,
        }}
      >
        {items.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "70%",
              gap: 2,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                bgcolor: "background.default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <ShoppingBag size={32} />
            </Box>
            <Typography variant="subtitle1" fontWeight="700">
              Seu carrinho está vazio
            </Typography>
            <Typography variant="body2" color="text.secondary" maxWidth={240}>
              Escolha peças do nosso catálogo ou solicite um modelo 3D sob medida.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={closeCartDrawer}
              sx={{ borderRadius: "40px", mt: 1 }}
            >
              Explorar Catálogo
            </Button>
          </Box>
        ) : (
          items.map((item) => {
            const compositeKey = getItemCompositeKey(item);
            return (
              <Box
                key={compositeKey}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 1.5,
                  borderRadius: 3,
                  bgcolor: "background.default",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={item.name}
                  sx={{
                    width: 74,
                    height: 74,
                    objectFit: "cover",
                    borderRadius: 2,
                    bgcolor: "background.paper",
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="700"
                    noWrap
                    sx={{ maxWidth: 190 }}
                  >
                    {item.name}
                  </Typography>

                  {item.color && (
                    <Box display="flex" alignItems="center" gap={1} my={0.5}>
                      <ColorSwatch colorName={item.color} size={14} />
                      <Typography variant="caption" color="text.secondary">
                        {item.color}
                      </Typography>
                    </Box>
                  )}

                  <Typography
                    variant="body2"
                    color="secondary.main"
                    fontWeight="800"
                  >
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </Typography>

                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={1}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      border="1px solid"
                      borderColor="divider"
                      borderRadius="30px"
                      bgcolor="background.paper"
                      px={0.5}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(compositeKey, item.quantity - 1)
                        }
                      >
                        <Minus size={12} />
                      </IconButton>
                      <Typography
                        variant="caption"
                        sx={{ px: 1.2, fontWeight: 700 }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(compositeKey, item.quantity + 1)
                        }
                      >
                        <Plus size={12} />
                      </IconButton>
                    </Box>

                    <IconButton
                      color="default"
                      size="small"
                      onClick={() => removeItem(compositeKey)}
                      sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {items.length > 0 && (
        <Box sx={{ mt: "auto", pt: 2, borderTop: 1, borderColor: "divider" }}>
          <Stack spacing={1} mb={2.5}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="body2" fontWeight="700">
                R$ {totalPrice.toFixed(2)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Envio
              </Typography>
              <Typography variant="caption" color="success.main" fontWeight="700">
                Calculado no checkout
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight="800">
                Total Estimado
              </Typography>
              <Typography variant="h6" fontWeight="900" color="secondary.main">
                R$ {totalPrice.toFixed(2)}
              </Typography>
            </Box>
          </Stack>

          <Button
            component={Link}
            to="/checkout"
            onClick={closeCartDrawer}
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            endIcon={<ArrowRight size={18} />}
            sx={{
              py: 1.5,
              borderRadius: "40px",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Finalizar Pedido
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
