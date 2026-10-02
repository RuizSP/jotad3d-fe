import { Box, Stack, Typography } from "@mui/material";
import { MapPin } from "lucide-react";
import type { StoreLocation } from "../../shared/interfaces/StoreLocation";

export default function StoreLocationAddress({
  location,
}: {
  location: StoreLocation;
}) {
  return (
    <Stack
      component="address"
      spacing={0.5}
      sx={{ minWidth: 0, fontStyle: "normal" }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <MapPin size={16} aria-hidden="true" />
        <Typography variant="subtitle2" fontWeight={700}>
          {location.name}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ overflowWrap: "anywhere" }}
      >
        {location.addressLine}, {location.number}
        {location.complement ? `, ${location.complement}` : ""}
        <br />
        {location.neighborhood}, {location.city} - {location.state}
        <br />
        CEP {location.postalCode}
      </Typography>
      {location.instructions && (
        <Typography variant="caption" color="text.secondary">
          {location.instructions}
        </Typography>
      )}
    </Stack>
  );
}
