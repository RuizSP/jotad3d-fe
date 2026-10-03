import { CssBaseline, ThemeProvider } from "@mui/material";
import { DialogsProvider } from "@toolpad/core";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, UserProvider } from "./providers";
import { CartProvider } from "./providers/CartContext";
import {
  ThemeToggleProvider,
  useThemeToggle,
} from "./providers/ThemeToggleContext";
import Router from "./router";
import ErrorBoundary from "./components/ui/ErrorBoundry";
import Error from "./components/ui/Error";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error("Falha ao buscar dados.", error);
      const message = query.meta?.errorMessage;
      toast.error(
        typeof message === "string"
          ? message
          : "Não foi possível carregar os dados.",
      );
    },
  }),
});

function AppContent() {
  const { theme } = useThemeToggle();
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <UserProvider>
          <CartProvider>
            <DialogsProvider>
              <Router />
            </DialogsProvider>
          </CartProvider>
        </UserProvider>
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeToggleProvider>
        <AuthProvider>
          <ErrorBoundary fallBack={(error) => <Error error={error} />}>
            <AppContent />
          </ErrorBoundary>
        </AuthProvider>
      </ThemeToggleProvider>
    </QueryClientProvider>
  );
}

export default App;
