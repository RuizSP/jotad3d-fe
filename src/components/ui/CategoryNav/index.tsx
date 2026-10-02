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
  Sparkles,
  Box as BoxIcon,
  Layers,
  Wrench,
  Search,
} from "lucide-react";

const CATEGORIES = [
  { label: "Todos", icon: Grid2X2, path: "/" },
  { label: "Decoração", icon: Sparkles, path: "/?cat=Decoração" },
  { label: "Colecionáveis", icon: BoxIcon, path: "/?cat=Colecionáveis" },
  { label: "Setup & Escritório", icon: Layers, path: "/?cat=Setup+%26+Escritório" },
  { label: "Engenharia", icon: Wrench, path: "/?cat=Engenharia" },
  { label: "Acompanhar Produção", icon: Search, path: "/tracking" },
];

export default function CategoryNav() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

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
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive =
              cat.path === "/"
                ? location.pathname === "/" && !location.search
                : location.pathname + location.search === cat.path;

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
