import {
  Dialog,
  Paper,
  type DialogProps as MuiDialogProps,
  type PaperProps,
} from "@mui/material";
import { useRef } from "react";
import Draggable from "react-draggable";

interface DialogRootProps<T = any> extends Omit<MuiDialogProps, "onClose"> {
  onClose?: (result?: T) => Promise<void>;
}

function PaperComponent(props: PaperProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper
        {...props}
        ref={nodeRef}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 24px 48px -12px rgba(0,0,0,0.3)",
          border: "1px solid",
          borderColor: "divider",
          ...props.sx,
        }}
      />
    </Draggable>
  );
}

export default function DialogRoot<T>(props: DialogRootProps<T>) {
  const { open, onClose, children, maxWidth = "sm", ...rest } = props;

  return (
    <Dialog
      open={open}
      maxWidth={maxWidth}
      fullWidth
      PaperComponent={PaperComponent}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          onClose?.();
        }
      }}
      aria-labelledby="draggable-dialog-title"
      {...rest}
    >
      {children}
    </Dialog>
  );
}
