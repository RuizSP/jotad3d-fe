import { Stack } from "@mui/material";
import type { ReactNode } from "react";

interface FilterHeaderProps {
  children: ReactNode;
}
export default function FilterHeader({ children }: FilterHeaderProps) {
  return (
    <Stack
      maxWidth={"100%"}
      direction={"row"}
      border={"1px solid"}
      borderRadius={2}
      color={"divider"}
      alignItems={"center"}
      pl={1}
      pr={1}
    >
      {children}
    </Stack>
  );
}
