import { Box, Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
  variant?: "text" | "contained" | "outlined";
}

export function SidebarToggle({
  collapsed,
  onToggle,
  variant = "text",
}: SidebarToggleProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
      <Button variant={variant} onClick={onToggle}>
        {collapsed ? (
          <ChevronRight width={16} height={16} />
        ) : (
          <ChevronLeft width={16} height={16} />
        )}
      </Button>
    </Box>
  );
}
