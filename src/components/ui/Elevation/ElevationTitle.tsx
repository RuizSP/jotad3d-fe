import { Typography, type TypographyProps } from "@mui/material";
import type { ReactNode } from "react";

type ElevationTitleProps = {
  title: ReactNode;
} & TypographyProps;

export default function ElevationTitle(props: ElevationTitleProps) {
  const { title: Title, ...rest } = props;
  return <Typography fontSize={14} children={Title} {...rest} />;
}
