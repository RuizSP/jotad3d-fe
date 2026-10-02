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
        backgroundColor: (theme) => theme.palette.background.paper,
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        mx: { xs: -1.25, sm: -3 },
        px: { xs: 1.25, sm: 3 },
        py: { xs: 1.25, sm: 2 },
        mb: { xs: 2, sm: 3 },
        borderRadius: 1,
      }}
      justifyContent={"center"}
    >
      <Stack
        justifyContent={"space-between"}
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={1}
        minWidth={0}
      >
        {children}
      </Stack>
    </Stack>
  );
}
