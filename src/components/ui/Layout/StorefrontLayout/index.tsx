import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import StoreHeader from "../../StoreHeader";
import CartDrawer from "../../CartDrawer";
import StoreFooter from "../../StoreFooter";
import CategoryNav from "../../CategoryNav";
import { OrderTrackingProvider } from "../../../../providers/OrderTrackingProvider";

export default function StorefrontLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <StoreHeader />
      <CategoryNav />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, pt: { xs: 3, sm: 4 } }}
      >
        <OrderTrackingProvider>
          <Outlet />
        </OrderTrackingProvider>
      </Box>

      <CartDrawer />
      <StoreFooter />
    </Box>
  );
}
