import {
  createTheme,
  darken,
  getContrastRatio,
  lighten,
  type Theme,
} from "@mui/material";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useBranding } from "../hooks/useBranding";
import { darkElegance, elegantGold } from "../themes";

const ThemeToggleContext = createContext<Theme | undefined>(undefined);

export function ThemeToggleProvider({ children }: { children: ReactNode }) {
  const { branding } = useBranding();
  const theme = useMemo(() => {
    const base =
      branding.themeName === "darkElegance" ? darkElegance : elegantGold;
    const accent = branding.accentColor;
    return createTheme(base, {
      palette: {
        secondary: {
          main: accent,
          light: lighten(accent, 0.25),
          dark: darken(accent, 0.25),
          contrastText:
            getContrastRatio(accent, "#FFFFFF") >= 4.5 ? "#FFFFFF" : "#0A0A0A",
        },
      },
    });
  }, [branding.themeName, branding.accentColor]);

  return (
    <ThemeToggleContext.Provider value={theme}>
      {children}
    </ThemeToggleContext.Provider>
  );
}

export function useThemeToggle() {
  const theme = useContext(ThemeToggleContext);
  if (!theme)
    throw new Error(
      "useThemeToggle deve ser usado dentro de um ThemeToggleProvider",
    );
  return { theme };
}
