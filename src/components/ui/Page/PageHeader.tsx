import { Stack } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeaderProps {
  children: ReactNode;
}

export default function PageHeader(props: PageHeaderProps) {
  const { children } = props;
  return (
    <Stack
      position={"sticky"}
      top={0}
      sx={{
        transition: "all 0.2s ease",
        zIndex: 10,
        backgroundColor: (theme) =>theme.palette.background.paper,
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        mx: -3,
        px: 3,
        py: 2,
        mb: 3,
        borderRadius:1
      }}
      justifyContent={"center"}
    >
      <Stack
        justifyContent={"space-between"}
        direction={"row"}
        alignItems={"center"}
      >
        {children}
      </Stack>
    </Stack>
  );
}
