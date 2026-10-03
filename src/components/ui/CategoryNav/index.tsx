import {
  Box,
  Container,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Grid2X2,
  Search,
} from "lucide-react";
import { useCatalogOptions } from "../../../hooks/useCatalogOptions";

export default function CategoryNav() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const { data: categories = [] } = useCatalogOptions("categories");
  const links = [
    { label: "Todos", icon: Grid2X2, path: "/" },
    ...categories.filter((category) => category.active).map((category) => ({
      label: category.name,
      icon: Grid2X2,
      path: `/?cat=${encodeURIComponent(category.name)}`,
    })),
    { label: "Acompanhar Produção", icon: Search, path: "/tracking" },
  ];

  if (isMobile) return null;

  return (
    <Box
      sx={{
        position: "sticky",
        top: 90,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        display: "flex",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        zIndex: 100,
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction="row"
          spacing={4}
          justifyContent="center"
          sx={{ py: 1.5, overflowX: "auto" }}
        >
          {links.map((cat) => {
            const Icon = cat.icon;
            const isActive =
              cat.path === "/"
                ? location.pathname === "/" && !new URLSearchParams(location.search).get("cat")
                : cat.path === "/tracking"
                  ? location.pathname === "/tracking"
                  : location.pathname === "/" && new URLSearchParams(location.search).get("cat") === cat.label;

            return (
              <Stack
                key={cat.label}
                direction="row"
                alignItems="center"
                spacing={1}
                component={Link}
                to={cat.path}
                sx={{
                  textDecoration: "none",
                  color: isActive ? "secondary.main" : "text.secondary",
                  fontWeight: isActive ? 800 : 500,
                  transition: "color 0.15s ease",
                  "&:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                <Icon size={16} />
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "nowrap", fontWeight: "inherit", fontSize: "0.85rem" }}
                >
                  {cat.label}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}
