import { CardContent, Stack } from "@mui/material";
import type { ReactNode } from "react";

interface ElevationContainerProps {
  children?: ReactNode;
  icon?: React.ElementType;
  iconSize?: number;
}

export default function ElevationContainer(props: ElevationContainerProps) {
  const { icon: Icon, iconSize = 20, children } = props;
  return (
    <CardContent
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: "100%",
      }}
    >
      <Stack spacing={2} direction="row" alignItems={"center"} width={"100%"}>
        {Icon && <Icon width={iconSize} height={iconSize} />}
        <Stack width={"100%"}>{children}</Stack>
      </Stack>
    </CardContent>
  );
}
