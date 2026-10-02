import {
  DialogContent as MuiDialogContent,
  Box,
  type DialogContentProps,
  type BoxProps,
} from "@mui/material";

interface DialogContentPropsLocal extends DialogContentProps {
  stackProps?: BoxProps;
  maxHeight?: string | number;
}

export default function DialogContent(props: DialogContentPropsLocal) {
  const {
    children,
    stackProps,
    maxHeight = "calc(85vh - 140px)",
    sx,
    ...rest
  } = props;

  return (
    <MuiDialogContent
      sx={{
        p: 3,
        overflowY: "auto",
        maxHeight,
        minHeight: 0,
        minWidth: 0,
        ...sx,
      }}
      draggable={false}
      {...rest}
    >
      <Box width="100%" {...stackProps}>
        {children}
      </Box>
    </MuiDialogContent>
  );
}
