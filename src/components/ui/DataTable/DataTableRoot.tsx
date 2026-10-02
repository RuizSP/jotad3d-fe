import { Card, Stack, alpha } from "@mui/material";      
import type { ReactNode } from "react";

interface DataTableRootProps {
  children: ReactNode;
  height?: string;
}

export default function DataTableRoot({
  children,
  height= "calc(100vh - 160px)",
}: DataTableRootProps) {
  return (
    <Card
      sx={{
        width: "100%",
        height: height,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        boxShadow: (theme) => theme.shadows[2],
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.default, 0.6)
            : alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(12px)",
      }}
    >
      <Stack spacing={0} height="100%">
        {children}
      </Stack>
    </Card>
  );
}
