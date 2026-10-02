import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface DataTableTitleProps {
  children: ReactNode;
}

export default function DataTableTitle({ children }: DataTableTitleProps) {
  return (
    <Box>
      <Typography whiteSpace={"none"} noWrap variant="h6">
        {children}
      </Typography>
    </Box>
  );
}
