import { Box, type BoxProps } from "@mui/material";
import type { ReactNode } from "react";

interface AppSidebarProps extends BoxProps {
  collapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function SidebarRoot({
  collapsed,
  children,
  sx = {},
  ...rest
}: AppSidebarProps) {
  return (
    <Box
      component={"nav"}
      sx={{
        width: collapsed ? 80 : 280,
        height: "100%",
        position: "sticky",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        backgroundColor: (theme) => theme.palette.background.paper,
        backdropFilter: "blur(20px)",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 100,
        p: 2,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}
