import { Box, useTheme, alpha } from "@mui/material";

interface HeaderProps {
  children: React.ReactNode;
}

export default function HeaderRoot({ children }: HeaderProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: { xs: 1, sm: 2 },
        bgcolor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.default, 0.7)
            : alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(12px)",
        borderRadius: { xs: 2, sm: 4 },
        border: "1px solid",
        borderColor: "divider",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        p: { xs: 1, sm: 2 },
        marginBottom: 3,
        position: "sticky",
        top: { xs: 6, sm: 16 },
        zIndex: 1100,
      }}
    >
      {children}
    </Box>
  );
}
