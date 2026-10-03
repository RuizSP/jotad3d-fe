import { Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Header } from "../../Header";
import { Sidebar } from "../../Sidebar";
import { AppContent } from "../AppContent";
import { AppShell } from "../AppShell";

import {
  Box,
  Drawer,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { menu } from "../../../../router";
import type { MenuItem } from "../../../../shared/interfaces/MenuItem";
import BrandIdentity from "../../../common/BrandIdentity";
import { useAuth } from "../../../../providers/AuthContext";

export default function Applayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeId, setActiveId] = useState("dashboard");
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const { user } = useAuth();
  const handleSelect = (item: MenuItem) => {
    setActiveId(item.id);
    setMobileNavigationOpen(false);
    if (item.path) navigate(item.path);
  };

  const adminUser = user ?? { name: "Administrador", role: "ADMIN" };

  return (
    <AppShell
      header={
        <Header.Root>
          <Stack spacing={1} direction="row" alignItems="center" minWidth={0}>
            {isMobile && (
              <IconButton
                aria-label="Abrir navegação"
                edge="start"
                onClick={() => setMobileNavigationOpen(true)}
              >
                <MenuIcon size={20} />
              </IconButton>
            )}
            <BrandIdentity />
          </Stack>

          <Box sx={{ display: { xs: "none", md: "block" }, flex: 1 }}>
            <Header.Search />
          </Box>
          <Header.UserMenu user={adminUser} />
        </Header.Root>
      }
      sidebar={
        <>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Sidebar.Root
              collapsed={collapsed}
              onToggle={() => setCollapsed(!collapsed)}
            >
              <Sidebar.Toggle
                collapsed={collapsed}
                onToggle={() => setCollapsed(!collapsed)}
              />
              <Sidebar.Nav
                collapsed={collapsed}
                items={menu}
                activeId={activeId}
                onSelect={handleSelect}
              />
              {!collapsed && (
                <Sidebar.Footer>
                  <Sidebar.Version />
                </Sidebar.Footer>
              )}
            </Sidebar.Root>
          </Box>
          <Drawer
            open={mobileNavigationOpen}
            onClose={() => setMobileNavigationOpen(false)}
            sx={{ display: { xs: "block", md: "none" } }}
            PaperProps={{
              sx: {
                width: "min(84vw, 300px)",
                p: 2,
                pt: "max(16px, env(safe-area-inset-top))",
              },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
            >
              <BrandIdentity />
              <IconButton
                aria-label="Fechar navegação"
                onClick={() => setMobileNavigationOpen(false)}
              >
                <X size={20} />
              </IconButton>
            </Stack>
            <Sidebar.Nav
              collapsed={false}
              items={menu}
              activeId={activeId}
              onSelect={handleSelect}
            />
          </Drawer>
        </>
      }
    >
      <AppContent>
        <Outlet />
      </AppContent>
    </AppShell>
  );
}
