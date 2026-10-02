import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthContext";

export default function RequireAdmin() {
  const { isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box minHeight="100dvh" display="grid" sx={{ placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
}
