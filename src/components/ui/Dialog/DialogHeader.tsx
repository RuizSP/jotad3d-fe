import { Stack, useTheme, type StackProps } from "@mui/material";

interface DialogHeaderProps extends StackProps {}

export default function DialogHeader(props: DialogHeaderProps) {
  const { children, sx, ...rest } = props;
  const theme = useTheme();

  return (
    <Stack
      spacing={2}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      minHeight={58}
      px={3}
      py={1.5}
      borderBottom={1}
      borderColor={theme.palette.divider}
      bgcolor={theme.palette.background.paper}
      id="draggable-dialog-title"
      sx={{
        cursor: "move",
        userSelect: "none",
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Stack>
  );
}
