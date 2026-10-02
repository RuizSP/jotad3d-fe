import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../providers/AuthContext";

interface LoginLocationState {
  from?: string;
}

export default function AdminLogin() {
  const { isAdmin, isLoading, signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (isLoading) {
    return (
      <Box minHeight="100dvh" display="grid" sx={{ placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      const state = location.state as LoginLocationState | null;
      navigate(state?.from?.startsWith("/admin/") ? state.from : "/admin", {
        replace: true,
      });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Não foi possível entrar no painel.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      minHeight="100dvh"
      display="grid"
      sx={{ placeItems: "center", p: 2, bgcolor: "background.default" }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: { xs: 2.5, sm: 4 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Acesso administrativo
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Entre com a conta autorizada para gerenciar a loja.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="E-mail"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={22} color="inherit" /> : "Entrar"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}