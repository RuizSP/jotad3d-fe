import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

interface OpenMenuProviderProps {
  children: ReactNode;
  initialOpenState?: boolean;
}

export interface OpenMenuContextType {
  isOpen: boolean;
  toggleOpen: () => void;
  setOpen: (value: boolean) => void;
  sideMenuWidth: string;
  minWidth: string;
  maxWidth: string;
  setMinWidth: (width: string) => void;
  setMaxWidth: (width: string) => void;
}

export const OpenMenuContext = createContext<OpenMenuContextType | undefined>(
  undefined,
);

export function OpenMenuProvider({
  children,
  initialOpenState: _open = true,
}: OpenMenuProviderProps) {
  const [isOpen, setIsOpen] = useState(_open);
  const [minWidth, setMinWidth] = useState("48px");
  const [maxWidth, setMaxWidth] = useState("250px");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const sideMenuWidth = useMemo(() => {
    if (isSmallScreen) return minWidth;
    return isOpen ? maxWidth : minWidth;
  }, [isOpen, isSmallScreen, maxWidth, minWidth]);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <OpenMenuContext.Provider
      value={{
        isOpen,
        toggleOpen,
        setOpen: setIsOpen,
        sideMenuWidth,
        minWidth,
        maxWidth,
        setMinWidth,
        setMaxWidth,
      }}
    >
      {children}
    </OpenMenuContext.Provider>
  );
}

export function useOpenMenu() {
  const context = useContext(OpenMenuContext);
  if (!context)
    throw new Error("useOpenMenu must be used within a OpenMenuProvider");
  return context;
}
