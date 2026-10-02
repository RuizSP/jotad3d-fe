import { Stack } from "@mui/material";

interface SidebarFooterProps {
  children: React.ReactNode;
}

export function SidebarFooter({ children }: SidebarFooterProps) {
  return (
    <Stack
      spacing={2}
      position={"absolute"}
      bottom={0}
      left={0}
      width={"100%"}
      height={"20%"}
      alignItems={"flex-start"}
      justifyContent={"flex-start"}
      padding={2}
    >
      {children}
    </Stack>
  );
}
