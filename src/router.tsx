import {
  Home as HomeIcon,
  ShoppingBag,
  Users as UsersIcon,
  Layers,
  Calculator,
} from "lucide-react";
import { Route, Routes } from "react-router-dom";
import Applayout from "./components/ui/Layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import type { MenuItem } from "./shared/interfaces/MenuItem";
import PageNotFound from "./components/ui/PageNotFound";
import Clientes from "./pages/Clientes";
import AdminProducts from "./pages/Admin/Products";
import AdminCalculator from "./pages/Admin/Calculator";
import StorefrontLayout from "./components/ui/Layout/StorefrontLayout";
import Home from "./pages/Store/Home";
import ProductDetails from "./pages/Store/ProductDetails";
import Checkout from "./pages/Store/Checkout";
import Orders from "./pages/Store/Orders";
import OrderTracking from "./pages/Store/OrderTracking";

export const menu: MenuItem[] = [
  {
    label: "Dashboard",
    icon: HomeIcon,
    id: "dashboard",
    path: "/admin/dashboard",
  },
  {
    label: "Catálogo 3D",
    icon: Layers,
    id: "produtos",
    path: "/admin/produtos",
  },
  {
    label: "Calculadora 3D",
    icon: Calculator,
    id: "calculadora",
    path: "/admin/calculadora",
  },
  {
    label: "Gestão de Pedidos",
    icon: ShoppingBag,
    id: "pedidos",
    path: "/admin/pedidos",
  },
  {
    label: "Clientes (WhatsApp)",
    icon: UsersIcon,
    id: "clientes",
    path: "/admin/clientes",
  },
];

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<StorefrontLayout />}>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="tracking" element={<OrderTracking />} />
      </Route>

      <Route path="/admin" element={<Applayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="produtos" element={<AdminProducts />} />
        <Route path="calculadora" element={<AdminCalculator />} />
        <Route path="pedidos" element={<Orders />} />
        <Route path="clientes" element={<Clientes />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
