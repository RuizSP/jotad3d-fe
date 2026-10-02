import { Stack } from "@mui/material";
import type { ReactNode } from "react";

interface PageRootProps {
  children: ReactNode;
}

export default function PageRoot(props: PageRootProps) {
  const { children } = props;

  return (
    <Stack spacing={2} width={"100%"}>
      {children}
    </Stack>
  );
}
