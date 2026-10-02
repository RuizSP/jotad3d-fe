import { Stack, type StackProps } from "@mui/material";
import type { ReactNode } from "react";

interface RecordCardHeaderProps extends StackProps {
  children: ReactNode;
}

export default function RecordCardHeader({
  children,
  sx,
  ...props
}: RecordCardHeaderProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      gap={1}
      sx={sx}
      {...props}
    >
      {children}
    </Stack>
  );
}
