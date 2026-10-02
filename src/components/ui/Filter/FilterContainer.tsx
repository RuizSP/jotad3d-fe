import { Stack } from "@mui/material";
import type { ReactNode } from "react";
import { OpenMenuProvider } from "../../../providers/OpenMenuProvider";

interface FilterContainerProps {
  children: ReactNode;
}

export default function FilterContainer({ children }: FilterContainerProps) {
  return (
    <OpenMenuProvider initialOpenState={false}>
      <Stack width={"100%"}> {children} </Stack>
    </OpenMenuProvider>
  );
}
