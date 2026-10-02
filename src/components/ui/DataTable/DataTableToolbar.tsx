import { Stack } from "@mui/material";
import type { ReactNode } from "react";

interface DataTableToolbarProps {
  children: ReactNode;
}

export default function DataTableToolbar({ children }: DataTableToolbarProps) {
  return (
    <Stack
      spacing={2}
      direction={"row"}
      width={"100%"}
      p={2}
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      {children}
    </Stack>
  );
}
