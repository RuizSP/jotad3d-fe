import { IconButton } from "@mui/material";
import { X } from "lucide-react";
import type { ElementType } from "react";

interface DialogActionCloseProps<T = any> {
  icon?: ElementType;
  onClose?: (result?: T) => Promise<any> | void;
}

export default function DialogActionClose<T>(props: DialogActionCloseProps<T>) {
  const { icon: Icon = X, onClose } = props;

  return (
    <IconButton
      onClick={() => {
        return onClose?.();
      }}
      size="small"
      sx={{
        color: "text.secondary",
        borderRadius: 2,
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: "grey.100",
          color: "text.primary",
        },
      }}
    >
      <Icon size={18} />
    </IconButton>
  );
}
