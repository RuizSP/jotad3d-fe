import { type Theme } from "@mui/material";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import * as themes from "../themes";

type ThemeName = keyof typeof themes;

type ThemeToggleType = {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
};
type ThemeToggleProviderProps = {
  children: ReactNode;
};

const ThemeToggleContext = createContext<ThemeToggleType | undefined>(
  undefined,
);

export const themeStorageKey = "@jotad3d:theme";

const DEFAULT_THEME_NAME: ThemeName = "elegantGold";

export function ThemeToggleProvider({ children }: ThemeToggleProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    const storedTheme = localStorage.getItem(themeStorageKey);
    return (storedTheme as ThemeName) || DEFAULT_THEME_NAME;
  });

  const [theme, setThemeObj] = useState<Theme>(
    themes[themeName] || themes.elegantGold,
  );

  useEffect(() => {
    const selectedTheme = themes[themeName];
    if (selectedTheme) {
      setThemeObj(selectedTheme);
      localStorage.setItem(themeStorageKey, themeName);
    }
  }, [themeName]);

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
  };

  return (
    <ThemeToggleContext.Provider value={{ theme, themeName, setTheme }}>
      {children}
    </ThemeToggleContext.Provider>
  );
}

export function useThemeToggle() {
  const context = useContext(ThemeToggleContext);
  if (!context) {
    throw new Error(
      "useThemeToggle deve ser usado dentro de um ThemeToggleProvider ",
    );
  }
  return context;
}
