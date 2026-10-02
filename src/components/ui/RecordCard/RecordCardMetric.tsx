import {
  Box,
  Typography,
  type BoxProps,
  type TypographyProps,
} from "@mui/material";
import type { ReactNode } from "react";
import RecordCardSubtitle from "./RecordCardSubtitle";

interface RecordCardMetricProps extends Omit<BoxProps, "children"> {
  label: ReactNode;
  value: ReactNode;
  valueProps?: TypographyProps;
  align?: "left" | "center" | "right";
}

export default function RecordCardMetric({
  label,
  value,
  valueProps,
  align = "left",
  sx,
  ...props
}: RecordCardMetricProps) {
  return (
    <Box minWidth={0} flex={1} textAlign={align} sx={sx} {...props}>
      <RecordCardSubtitle display="block">{label}</RecordCardSubtitle>
      <Typography
        variant="body2"
        fontWeight={700}
        sx={{ overflowWrap: "anywhere" }}
        {...valueProps}
      >
        {value}
      </Typography>
    </Box>
  );
}
