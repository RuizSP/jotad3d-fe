import { Typography, type TypographyProps } from "@mui/material";
import type { ReactNode } from "react";

interface RecordCardTitleProps extends TypographyProps {
  children: ReactNode;
}

export default function RecordCardTitle({
  children,
  sx,
  ...props
}: RecordCardTitleProps) {
  return (
    <Typography
      variant="subtitle2"
      fontWeight={700}
      sx={{ minWidth: 0, overflowWrap: "anywhere", ...sx }}
      {...props}
    >
      {children}
    </Typography>
  );
}
