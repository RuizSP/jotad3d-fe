import { Divider, Popover, Stack, type PopoverProps } from "@mui/material";
import UserAvatar from "../UserAvatar/inex";
import HeaderUserInfo from "./HeaderUserInfo";
import type { UserInfo } from "../../../shared/interfaces/UserInfo";

type HeaderPopoverMenuProps = {
  user: UserInfo;
} & PopoverProps;

export default function HeaderPopoverMenu(props: HeaderPopoverMenuProps) {
  const { user, open, children, ...rest } = props;
  return (
    <Popover open={open} {...rest}>
      <Stack
        minHeight={"40vh"}
        minWidth={"15vw"}
        divider={<Divider variant="middle" />}
        p={1}
      >
        <Stack alignItems={"center"} p={2} spacing={1}>
          <UserAvatar name={user.name} src={user.avatarUrl} size={48} />
          <HeaderUserInfo
            user={{ name: user.name, role: user.role }}
            textAlign={"center"}
          />
        </Stack>
        {children}
      </Stack>
    </Popover>
  );
}
