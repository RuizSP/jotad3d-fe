import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface AppShellProps {
  header: ReactNode;
  sidebar: ReactNode;
  toolbar: ReactNode;
  children: ReactNode;
}

export function AppShell({
  header,
  sidebar,
  toolbar,
  children,
}: AppShellProps) {
  return (
    <Box
      sx={{ height: "100vh", display: "flex", flexDirection: "column", p: 1 }}
    >
      {header}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {sidebar}
        <Box sx={{ display: "flex", flex: 1, flexDirection: "column", gap: 1 }}>
          {children}
        </Box>
      </Box>
      {/* Toolbar agora fica fixa na parte inferior */}
      {toolbar}
    </Box>
  );
}
