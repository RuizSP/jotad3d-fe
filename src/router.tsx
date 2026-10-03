import {
  Home as HomeIcon,
  ShoppingBag,
  Users as UsersIcon,
  Layers,
  Calculator,
  Settings,
  ListPlus,
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
import AdminLogin from "./pages/Admin/Login";
import RequireAdmin from "./components/auth/RequireAdmin";
import StoreLocationSettings from "./pages/Admin/Settings";
import CatalogOptions from "./pages/Admin/CatalogOptions";

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
    label: "Opções do Catálogo",
    icon: ListPlus,
    id: "catalog-options",
    path: "/admin/opcoes",
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
  {
    label: "Configurações",
    icon: Settings,
    id: "configuracoes",
    path: "/admin/settings",
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

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<Applayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="produtos" element={<AdminProducts />} />
          <Route path="opcoes" element={<CatalogOptions />} />
          <Route path="calculadora" element={<AdminCalculator />} />
          <Route path="pedidos" element={<Orders />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="settings" element={<StoreLocationSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
