import { Button, CircularProgress, type ButtonProps } from "@mui/material";

interface DialogActionSubmitProps extends ButtonProps {
  onSubmit?: () => void;
  label?: string;
  isLoading?: boolean;
  loading?: boolean;
}

export default function DialogActionSubmit(props: DialogActionSubmitProps) {
  const {
    onSubmit,
    onClick,
    label = "Salvar",
    isLoading,
    loading,
    disabled,
    children,
    sx,
    ...rest
  } = props;

  const isSubmitting = Boolean(isLoading || loading);

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (onClick) {
      onClick(e);
    } else if (onSubmit) {
      onSubmit();
    }
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      disabled={disabled || isSubmitting}
      sx={{
        borderRadius: 2,
        px: 3,
        py: 1,
        fontWeight: 700,
        textTransform: "none",
        ...sx,
      }}
      {...rest}
    >
      {isSubmitting ? (
        <CircularProgress size={18} color="inherit" />
      ) : (
        children || label
      )}
    </Button>
  );
}
