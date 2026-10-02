import { Stack, type StackProps } from "@mui/material";
import type { ReactNode } from "react";

interface RecordCardMetricsProps extends StackProps {
  children: ReactNode;
}

export default function RecordCardMetrics({
  children,
  sx,
  ...props
}: RecordCardMetricsProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      gap={1}
      mt={1.25}
      sx={sx}
      {...props}
    >
      {children}
    </Stack>
  );
}
