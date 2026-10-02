import { CssBaseline, ThemeProvider } from "@mui/material";
import { DialogsProvider } from "@toolpad/core";
import { BrowserRouter } from "react-router-dom";
import { AppToolbarProvider, UserProvider } from "./providers";
import { CartProvider } from "./providers/CartContext";
import {
  ThemeToggleProvider,
  useThemeToggle,
} from "./providers/ThemeToggleContext";
import Router from "./router";
import ErrorBoundary from "./components/ui/ErrorBoundry";
import Error from "./components/ui/Error";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

function AppContent() {
  const { theme } = useThemeToggle();
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <UserProvider>
          <AppToolbarProvider>
            <CartProvider>
              <DialogsProvider>
                <Router />
              </DialogsProvider>
            </CartProvider>
          </AppToolbarProvider>
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
        <ErrorBoundary fallBack={(error) => <Error error={error} />}>
          <AppContent />
        </ErrorBoundary>
      </ThemeToggleProvider>
    </QueryClientProvider>
  );
}

export default App;
