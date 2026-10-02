import {
  Breadcrumbs,
  Stack,
  Typography,
  type TypographyProps,
} from "@mui/material";
import { type ElementType } from "react";
import { Link as RouterLink } from "react-router-dom";

interface PageTitleProps {
  icon?: ElementType;
  iconSize?: number;
  links: { title: string; path?: string }[];
  typographyProps?: TypographyProps;
}

export default function PageTitle({
  icon: Icon,
  iconSize = 24,
  links,
  typographyProps,
}: PageTitleProps) {
  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, sm: 2 }}
      alignItems="center"
      minWidth={0}
    >
      {Icon && <Icon width={iconSize} height={iconSize} />}

      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ minWidth: 0, "& .MuiBreadcrumbs-ol": { flexWrap: "wrap" } }}
      >
        {links.map((item, index) => {
          const isLast = index === links.length - 1;

          return (
            <Typography
              key={index}
              variant="h6"
              component={item.path && !isLast ? RouterLink : "span"}
              to={item.path}
              aria-current={isLast ? "page" : undefined}
              sx={{
                textDecoration: "none",
                color: isLast ? "text.primary" : "inherit",
                cursor: item.path && !isLast ? "pointer" : "default",
                fontSize: { xs: "0.95rem", sm: "1.25rem" },
                overflowWrap: "anywhere",
              }}
              {...typographyProps}
            >
              {item.title}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </Stack>
  );
}
