import { DialogActions, Stack, type StackProps } from "@mui/material";

export default function DialogHeaderActions(props: StackProps) {
  const { children, ...rest } = props;
  return (
    <DialogActions>
      <Stack spacing={1} direction={"row"} {...rest}>
        {children}
      </Stack>
    </DialogActions>
  );
}
