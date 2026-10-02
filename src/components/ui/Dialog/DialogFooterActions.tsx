import { Box, type BoxProps } from "@mui/material";

export default function DialogFooterActions(props: BoxProps) {
  const { children, sx, ...rest } = props;

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1.5}
      ml="auto"
      sx={sx}
      {...rest}
    >
      {children}
    </Box>
  );
}
