import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Button, Typography, alpha } from "@mui/material";
import type { MenuItem } from "../../../shared/interfaces/MenuItem";

interface SidebarNavItemProps {
  item: MenuItem;
  collapsed: boolean;
  active?: boolean;
  open?: boolean;
  onClick: (item: MenuItem, event?: React.MouseEvent<HTMLElement>) => void;
  variant?: "text" | "contained" | "outlined";
}

export function SidebarNavItem({
  item,
  collapsed,
  active,
  open,
  onClick,
  variant = "text",
}: SidebarNavItemProps) {
  const Icon = item.icon;
  const hasChildren = !!item.items?.length;

  return (
    <Button
      variant={variant}
      onClick={(e) => onClick(item, e)}
      title={item.label}
      sx={{
        width: "100%",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: 1.5,
        textTransform: "none",
        py: 1.5,
        px: 2,
        borderRadius: 2,
        color: active ? "primary.main" : "text.secondary",
        background: active
          ? (theme) => alpha(theme.palette.primary.main, 0.1)
          : "transparent",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: (theme) => alpha(theme.palette.action.active, 0.08),
          transform: "translateX(4px)",
          color: active ? "primary.dark" : "text.primary",
        },
        ...(collapsed && {
          minWidth: 48,
          px: 1,
        }),
        ...(active && {
          fontWeight: 600,
        }),
      }}
    >
      {Icon && <Icon width={20} height={20} />}

      {!collapsed && (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2">{item.label}</Typography>

          {hasChildren && (
            <KeyboardArrowDownIcon
              sx={{
                transition: "transform 0.2s ease",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                fontSize: 20,
                opacity: 0.7,
              }}
            />
          )}
        </Box>
      )}
    </Button>
  );
}
