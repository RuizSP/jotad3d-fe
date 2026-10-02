import { Drawer } from "@mui/material";
import type { ReactNode } from "react";
import { useOpenMenu } from "../../../providers/OpenMenuProvider";

interface FilterContentProps {
  children: ReactNode;
}
export default function FilterContent({ children }: FilterContentProps) {
  const { isOpen, setOpen } = useOpenMenu();
  return (
    <Drawer
      elevation={1}
      slotProps={{ paper: { sx: { width: "20%" } } }}
      open={isOpen}
      onClose={() => {
        setOpen(false);
      }}
      anchor="right"
    >
      {children}
    </Drawer>
  );
}
