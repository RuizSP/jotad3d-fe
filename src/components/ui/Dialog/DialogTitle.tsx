import {
  Stack,
  Typography,
  type StackProps,
  type TypographyProps,
} from "@mui/material";
import type { ElementType } from "react";

interface DialogTitleProps {
  title: string;
  icon?: ElementType;
  iconSize?: number;
  titleProps?: TypographyProps;
  stackProps?: StackProps;
}

export default function DialogTitle(props: DialogTitleProps) {
  const { title, icon: Icon, iconSize = 20, stackProps, titleProps } = props;

  return (
    <Stack
      spacing={1.5}
      direction="row"
      alignItems="center"
      {...stackProps}
    >
      {Icon && <Icon width={iconSize} height={iconSize} color="currentColor" />}
      <Typography
        variant="subtitle1"
        fontWeight={800}
        color="text.primary"
        {...titleProps}
      >
        {title}
      </Typography>
    </Stack>
  );
}
