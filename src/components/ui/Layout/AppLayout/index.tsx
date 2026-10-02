import { Box } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Header } from "../../Header";
import { Sidebar } from "../../Sidebar";
import { AppContent } from "../AppContent";
import { AppShell } from "../AppShell";

import { Stack } from "@mui/material";
import { menu } from "../../../../router";
import type { MenuItem } from "../../../../shared/interfaces/MenuItem";
import type { UserInfo } from "../../../../shared/interfaces/UserInfo";
import ThemeSwitch from "../../ThemeSwitch";
import { AppToolbar } from "../AppToolbar";

export default function Applayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeId, setActiveId] = useState("dashboard");

  const navigate = useNavigate();
  const handleSelect = (item: MenuItem) => {
    setActiveId(item.id);
    if (item.path) navigate(item.path);
  };

  const user: UserInfo = {
    name: "JOTAD 3D",
    role: "Administrador",
    avatarUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
  };

  return (
    <AppShell
      header={
        <Header.Root>
          <Stack spacing={2} direction="row" alignItems="center">
            <Header.Brand companyName="JOTAD 3D" icon={Box} />
          </Stack>

          <Header.Search />
          <Header.UserMenu user={user}>
            <ThemeSwitch />
          </Header.UserMenu>
        </Header.Root>
      }
      sidebar={
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
      }
      toolbar={
        <AppToolbar.Root trigger={<AppToolbar.Trigger />}>
          <AppToolbar.Container>
            <AppToolbar.Content />
          </AppToolbar.Container>
        </AppToolbar.Root>
      }
    >
      <AppContent>
        <Outlet />
      </AppContent>
    </AppShell>
  );
}
