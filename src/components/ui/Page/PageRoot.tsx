import { Stack } from "@mui/material";
import type { ReactNode } from "react";

interface PageRootProps {
  children: ReactNode;
}

export default function PageRoot(props: PageRootProps) {
  const { children } = props;

  return (
    <Stack spacing={{ xs: 1.5, sm: 2 }} width="100%" minWidth={0}>
      {children}
    </Stack>
  );
}
