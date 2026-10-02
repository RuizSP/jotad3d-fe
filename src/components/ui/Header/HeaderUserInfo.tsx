import { Box, Typography, type BoxProps } from "@mui/material";
import type { UserInfo } from "../../../shared/interfaces/UserInfo";

type HeaderUserInfoProps = {
  user: UserInfo;
} & BoxProps;

export default function HeaderUserInfo({
  user,
  textAlign = "right",
}: HeaderUserInfoProps) {
  return (
    <Box textAlign={textAlign}>
      <Typography fontSize={14} fontWeight={500}>
        {user.name}
      </Typography>

      <Typography fontSize={12}>{user.role}</Typography>
    </Box>
  );
}
