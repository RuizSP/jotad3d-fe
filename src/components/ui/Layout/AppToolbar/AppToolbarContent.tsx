import { Stack } from "@mui/material";
import { useAppToolbar, useOpenMenu } from "../../../../providers";
import { AppToolbarItem } from "./AppToolbarItem";
import { useEffect } from "react";

export function AppToolbarContent() {
  const { dialog } = useAppToolbar();
  const { setOpen } = useOpenMenu();
  const hasDialogs = dialog.length > 0;

  useEffect(() => {
    if (!hasDialogs) {
      setOpen(false);
    }
  }, [hasDialogs, setOpen]);

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      {dialog.map((item) => (
        <AppToolbarItem key={item.id} dialog={item} />
      ))}
    </Stack>
  );
}
