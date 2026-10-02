import { Badge, Box, IconButton, useTheme } from "@mui/material";
import { AppWindowMac } from "lucide-react";
import { useAppToolbar, useOpenMenu } from "../../../../providers";

export default function AppToolbarTrigger() {
  const { setOpen, isOpen } = useOpenMenu();
  const { dialog } = useAppToolbar();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const dialogCount = dialog.length;

  return (
    <Badge
      badgeContent={dialogCount}
      color="error"
      overlap="circular"
      sx={{
        "& .MuiBadge-badge": {
          fontSize: "0.75rem",
          fontWeight: 700,
          minWidth: 20,
          height: 20,
          borderRadius: "10px",
          border: `2px solid ${theme.palette.background.default}`,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          borderRadius: "50%",
          background: isDark
            ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          padding: "2px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
          },
        }}
      >
        <IconButton
          size="large"
          onClick={() => {
            if (dialog.length) setOpen(!isOpen);
          }}
          sx={{
            background: theme.palette.background.default,
            color: theme.palette.primary.main,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: theme.palette.background.default,
              transform: "rotate(180deg)",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
            ...(isOpen && {
              background: isDark
                ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              color: theme.palette.primary.contrastText,
              transform: "rotate(180deg)",
            }),
          }}
        >
          <AppWindowMac
            style={{
              transition: "transform 0.3s ease",
              transform: isOpen ? "scale(1.1)" : "scale(1)",
            }}
          />
        </IconButton>
      </Box>
    </Badge>
  );
}
