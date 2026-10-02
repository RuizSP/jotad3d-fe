import { Stack, Typography } from "@mui/material";
import { SVG } from "../SVG";

export default function PageNotFound() {
  return (
    <Stack
      spacing={2}
      width={"100%"}
      maxHeight={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <SVG.NotFound />
      <Typography variant="h3" color="error">
        404!
      </Typography>
      <Typography variant="h5">Página Não Encontrada!</Typography>
    </Stack>
  );
}
