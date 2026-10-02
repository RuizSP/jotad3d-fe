import { createTheme } from "@mui/material";
import { baseTheme } from "./base";

export const elegantGold = createTheme({
  ...baseTheme,
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  palette: {
    mode: "light",
    primary: {
      main: "#0A0A0A",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#D4AF37",
      light: "#E8C766",
      dark: "#A38218",
      contrastText: "#0A0A0A",
    },
    background: {
      default: "#F9F9FB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111111",
      secondary: "#666666",
    },
    divider: "#E5E7EB",
  },
  shape: {
    borderRadius: 16,
  },
  components: baseTheme.components,
});
