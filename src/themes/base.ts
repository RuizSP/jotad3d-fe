import type { ThemeOptions } from "@mui/material";

export const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 40,
          textTransform: "none",
          fontWeight: 600,
          letterSpacing: "0.02em",
          paddingLeft: 20,
          paddingRight: 20,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        size: "small",
        InputLabelProps: { shrink: true },
      },
    },
  },
};
