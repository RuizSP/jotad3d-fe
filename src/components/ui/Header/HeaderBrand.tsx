import { Stack, Typography } from "@mui/material";

interface HeaderBrandProps {
  companyName: string;
  icon?: React.ElementType;
  iconSize?: number;
}

export default function HeaderBrand(props: HeaderBrandProps) {
  const { companyName, icon: Icon, iconSize = 24 } = props;

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {Icon && <Icon width={iconSize} height={iconSize} />}
      <Typography variant="h6">{companyName}</Typography>
    </Stack>
  );
}
