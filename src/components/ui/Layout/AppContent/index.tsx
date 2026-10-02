import { Box } from "@mui/material";

interface AppContentProps {
  children: React.ReactNode;
}

export function AppContent({ children }: AppContentProps) {
  return <Box sx={{ flex: 1, overflow: "auto", p: 2, }}>{children}</Box>;
}
