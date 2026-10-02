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
      sx={{
        height: "100dvh",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        p: { xs: 0.75, sm: 1 },
        overflow: "hidden",
      }}
    >
      {header}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {sidebar}
        <Box
          sx={{
            display: "flex",
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            flexDirection: "column",
            gap: 1,
          }}
        >
          {children}
        </Box>
      </Box>
      {/* Toolbar agora fica fixa na parte inferior */}
      {toolbar}
    </Box>
  );
}
