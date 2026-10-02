import {
  Dialog,
  Paper,
  useMediaQuery,
  useTheme,
  type DialogProps as MuiDialogProps,
  type PaperProps,
} from "@mui/material";
import { useRef } from "react";
import Draggable from "react-draggable";

interface DialogRootProps<T = unknown> extends Omit<MuiDialogProps, "onClose"> {
  onClose?: (result?: T) => Promise<void>;
}

function PaperComponent(props: PaperProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const paper = (
    <Paper
      {...props}
      ref={nodeRef}
      sx={{
        borderRadius: isMobile ? 0 : 3,
        overflow: "hidden",
        boxShadow: isMobile ? "none" : "0 24px 48px -12px rgba(0,0,0,0.3)",
        border: isMobile ? 0 : "1px solid",
        borderColor: "divider",
        ...props.sx,
      }}
    />
  );

  if (isMobile) return paper;

  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      {paper}
    </Draggable>
  );
}

export default function DialogRoot<T>(props: DialogRootProps<T>) {
  const { open, onClose, children, maxWidth = "sm", ...rest } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      {...rest}
      open={open}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={isMobile}
      PaperComponent={PaperComponent}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          onClose?.();
        }
      }}
      aria-labelledby="draggable-dialog-title"
    >
      {children}
    </Dialog>
  );
}
