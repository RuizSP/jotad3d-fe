import { Box, Stack, Typography } from "@mui/material";
import { Box as BoxIcon } from "lucide-react";
import { useBranding } from "../../hooks/useBranding";

export default function BrandIdentity({ light = false }: { light?: boolean }) {
  const { branding } = useBranding();

  return (
    <Stack direction="row" spacing={1.2} alignItems="center" minWidth={0}>
      {branding.logoUrl ? (
        <Box
          component="img"
          src={branding.logoUrl}
          alt=""
          sx={{ width: 38, height: 38, objectFit: "contain" }}
        />
      ) : (
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            bgcolor: "secondary.main",
            color: "secondary.contrastText",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <BoxIcon size={20} />
        </Box>
      )}
      <Typography
        variant="h6"
        fontWeight={900}
        noWrap
        sx={{
          color: light ? "#FFFFFF" : "text.primary",
          letterSpacing: "-0.03em",
        }}
      >
        {branding.companyName}
      </Typography>
    </Stack>
  );
}
