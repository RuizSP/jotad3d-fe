import { Button, type ButtonProps } from "@mui/material";

interface DialogActionCancelProps<T = unknown> extends ButtonProps {
  onCancel?: (result?: T) => Promise<void> | void;
  label?: string;
}

export default function DialogActionCancel<T>(
  props: DialogActionCancelProps<T>,
) {
  const {
    onCancel,
    onClick,
    label = "Cancelar",
    children,
    sx,
    ...rest
  } = props;

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (onClick) {
      onClick(e);
    } else if (onCancel) {
      await onCancel();
    }
  }

  return (
    <Button
      variant="outlined"
      color="inherit"
      onClick={handleClick}
      sx={{
        borderRadius: 2,
        px: 2.5,
        py: 1,
        fontWeight: 600,
        textTransform: "none",
        borderColor: "divider",
        color: "text.secondary",
        "&:hover": {
          borderColor: "text.secondary",
          bgcolor: "grey.100",
        },
        ...sx,
      }}
      {...rest}
    >
      {children || label}
    </Button>
  );
}
