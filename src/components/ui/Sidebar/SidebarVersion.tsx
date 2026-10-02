import { Button, Stack, Typography } from "@mui/material";
import { MoveDown } from "lucide-react";

export function SidebarVersion() {
  return (
    <Button variant="text" endIcon={<MoveDown size={16} />}>
      <Stack alignItems="center" justifyContent="center" direction="row">
        <Typography variant="caption">Version: 0.0.0</Typography>
      </Stack>
    </Button>
  );
}
