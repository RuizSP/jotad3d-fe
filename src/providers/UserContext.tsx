import { createContext, useContext, useState, type ReactNode } from "react";
import type { UserInfo } from "../shared/interfaces/UserInfo";

type UserContextType = {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(null);

  const logout = () => {
    setUser(null);
  };

  const value: UserContextType = {
    user,
    setUser,
    isAuthenticated: !!user,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }

  return context;
}
