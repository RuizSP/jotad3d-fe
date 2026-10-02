import { Box, Collapse, Stack } from "@mui/material";
import { useOpenMenu } from "../../../../providers";

interface AppToolbarRootProps {
  children: React.ReactNode;
}

export function AppToolbarContainer({ children }: AppToolbarRootProps) {
  const { isOpen } = useOpenMenu();

  return (
    <Collapse in={isOpen} orientation="horizontal" timeout={300}>
      <Box
        sx={{
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          bgcolor={(theme) => theme.palette.background.default}
          sx={{
            px: 3,
            py: 1.5,
            backdropFilter: "blur(12px)",
            borderRadius: 3,
            border: (theme) =>
              `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)"
              }`,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)"
                : "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 12px 40px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)"
                  : "0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          {children}
        </Stack>
      </Box>
    </Collapse>
  );
}
