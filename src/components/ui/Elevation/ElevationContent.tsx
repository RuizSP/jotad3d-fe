import { Stack, type StackProps } from "@mui/material";
import type { ReactNode } from "react";

type ElevationContentProps = {
  children: ReactNode;
} & StackProps;

export default function ElevationContent(props: ElevationContentProps) {
  const { children, ...rest } = props;
  return (
    <Stack spacing={2} {...rest}>
      {children}
    </Stack>
  );
}
