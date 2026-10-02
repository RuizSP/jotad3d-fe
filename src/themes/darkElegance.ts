import { createTheme } from "@mui/material";
import { baseTheme } from "./base";

export const darkElegance = createTheme({
  ...baseTheme,
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#F5F5F5",
      contrastText: "#0A0A0A",
    },
    secondary: {
      main: "#D4AF37",
      light: "#E8C766",
      dark: "#A38218",
      contrastText: "#0A0A0A",
    },
    background: {
      default: "#0A0A0A",
      paper: "#161616",
    },
    text: {
      primary: "#F5F5F5",
      secondary: "#A0A0A0",
    },
    divider: "#2A2A2A",
  },
  shape: {
    borderRadius: 16,
  },
  components: baseTheme.components,
});
