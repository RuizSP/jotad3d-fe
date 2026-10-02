import { Box, useTheme, type BoxProps } from "@mui/material";

export default function DialogFooter(props: BoxProps) {
  const { children, sx, ...rest } = props;
  const theme = useTheme();

  return (
    <Box
      borderTop={1}
      borderColor={theme.palette.divider}
      bgcolor={theme.palette.background.paper}
      px={3}
      py={2}
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={sx}
      {...rest}
    >
      {children}
    </Box>
  );
}
