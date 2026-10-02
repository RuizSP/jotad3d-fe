import { Box } from "@mui/material";

interface AppContentProps {
  children: React.ReactNode;
}

export function AppContent({ children }: AppContentProps) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflow: "auto",
        p: { xs: 1.25, sm: 2 },
        pb: { xs: "calc(76px + env(safe-area-inset-bottom))", sm: 2 },
      }}
    >
      {children}
    </Box>
  );
}
