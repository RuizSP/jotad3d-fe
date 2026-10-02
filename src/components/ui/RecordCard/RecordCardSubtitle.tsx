import { Typography, type TypographyProps } from "@mui/material";
import type { ReactNode } from "react";

interface RecordCardSubtitleProps extends TypographyProps {
  children: ReactNode;
}

export default function RecordCardSubtitle({
  children,
  sx,
  ...props
}: RecordCardSubtitleProps) {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ overflowWrap: "anywhere", ...sx }}
      {...props}
    >
      {children}
    </Typography>
  );
}
