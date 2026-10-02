import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import type { UserInfo } from "../shared/interfaces/UserInfo";
import { supabase } from "../services/supabase";

interface AuthContextValue {
  user: UserInfo | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const toUserInfo = (user: User | null): UserInfo | null => {
  if (!user) return null;

  const role =
    typeof user.app_metadata.role === "string" ? user.app_metadata.role : "";

  return {
    name: user.user_metadata.full_name || user.email || "Administrador",
    role: role.toUpperCase(),
    avatarUrl: user.user_metadata.avatar_url,
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(toUserInfo(session?.user ?? null));
      setIsLoading(false);
    });

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) console.error("Falha ao restaurar sessão.", error);
        setUser(toUserInfo(data.session?.user ?? null));
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        console.error("Falha ao restaurar sessão.", error);
        setIsLoading(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error("Supabase não está configurado.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    if (data.user.app_metadata.role !== "admin") {
      await supabase.auth.signOut();
      throw new Error("Esta conta não tem acesso ao painel administrativo.");
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAdmin: user?.role.toLowerCase() === "admin",
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}