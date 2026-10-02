import { Stack, Typography, useTheme } from "@mui/material";
import { SVG } from "../SVG";

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  const theme = useTheme();
  return (
    <Stack
      spacing={2}
      width={"100%"}
      maxHeight={"80vh"}
      justifyContent={"center"}
      alignItems={"center"}
      p={5}
      overflow={"hidden"}
    >
      <SVG.ErrorInfo />
      <Stack>
        <Typography variant="h5" textAlign={"center"}>
          Um erro muito esperado ocorreu!
        </Typography>
        <Typography variant="h6">
          Quando isso acontecer, pare, deite e role. Provavelmente vai resolver
          o problema.
        </Typography>
      </Stack>

      <Stack
        bgcolor={theme.palette.error.main}
        width={"80%"}
        height="fit-content"
        p={2}
        borderRadius={5}
        alignItems="center"
        overflow={"auto"}
      >
        <Typography variant="h6">{error.message}</Typography>
        <Typography variant="body1">{error.name}</Typography>
        <Typography variant="body2">{error.stack}</Typography>
      </Stack>
    </Stack>
  );
}
