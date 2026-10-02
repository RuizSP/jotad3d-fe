import { Avatar, useTheme, type AvatarProps } from "@mui/material";
import { User } from "lucide-react";

interface UserAvatarProps extends AvatarProps {
  name: string;
  src?: string;
  size?: number;
}

export default function UserAvatar(props: UserAvatarProps) {
  const { name, src, size = 32, variant = "circular", ...rest } = props;
  const theme = useTheme();
  return (
    <Avatar
      variant={variant}
      sx={{
        width: size,
        height: size,
        border: `2px solid ${theme.palette.background.default}`,
        bgcolor: "transparent",
      }}
      src={src}
      {...rest}
    >
      {!src && <User width={16} height={16} />}
    </Avatar>
  );
}
