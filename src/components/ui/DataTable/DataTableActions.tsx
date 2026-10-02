import { Box, Stack } from "@mui/material";
import type { ReactNode } from "react";

interface DataTableActionsProps {
  children: ReactNode;
}

export default function DataTableActions({ children }: DataTableActionsProps) {
  return (
    <Box>
      <Stack direction="row" spacing={2} width="100%">
        {children}
      </Stack>
    </Box>
  );
}
