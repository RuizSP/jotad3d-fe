import { Stack, type StackProps } from "@mui/material";

export function PageContent(props: StackProps) {
  return (
    <Stack spacing={{ xs: 1.5, sm: 2 }} width="100%" minWidth={0} {...props} />
  );
}
