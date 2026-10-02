import type { CardProps } from "@mui/material";
import type { ReactNode } from "react";
import ElevationRoot from "../Elevation/ElevationRoot";

interface RecordCardRootProps extends Omit<CardProps, "children"> {
  children: ReactNode;
}

export default function RecordCardRoot({
  children,
  sx,
  ...props
}: RecordCardRootProps) {
  return (
    <ElevationRoot
      motionProps={{ initial: false }}
      cardProps={{
        ...props,
        sx: {
          p: 1.5,
          minWidth: 0,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
          ...sx,
        },
      }}
    >
      {children}
    </ElevationRoot>
  );
}
