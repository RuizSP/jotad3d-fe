import { Stack } from "@mui/material";
import type { ReactNode } from "react";

interface DataTableToolbarProps {
  children: ReactNode;
}

export default function DataTableToolbar({ children }: DataTableToolbarProps) {
  return (
    <Stack
      spacing={2}
      direction={{ xs: "column", sm: "row" }}
      width={"100%"}
      minWidth={0}
      p={{ xs: 1.5, sm: 2 }}
      alignItems={{ xs: "stretch", sm: "center" }}
      justifyContent={"space-between"}
      sx={{ borderBottom: 1, borderColor: "divider", flexWrap: "wrap" }}
    >
      {children}
    </Stack>
  );
}
