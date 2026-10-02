import { Stack, type StackProps } from "@mui/material";

export default function PageHeaderActions(props: StackProps) {
  return <Stack direction="row" spacing={2} {...props} />;
}
