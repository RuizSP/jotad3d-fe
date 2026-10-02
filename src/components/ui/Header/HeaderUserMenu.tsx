import { IconButton, ListItemIcon, MenuItem, Stack } from "@mui/material";
import { LogOut, PackageOpen, Settings } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { UserInfo } from "../../../shared/interfaces/UserInfo";
import { useAuth } from "../../../providers/AuthContext";
import { toast } from "react-toastify";
import UserAvatar from "../UserAvatar/inex";
import HeaderPopoverMenu from "./HeaderPopoverMenu";
import HeaderUserInfo from "./HeaderUserInfo";

export default function HeaderUserMenu({
  children,
  user,
}: {
  children?: ReactNode;
  user: UserInfo;
}) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const menuConfig = [
    {
      label: "Meus Pedidos",
      action: () => {
        setOpen(false);
        navigate("/orders");
      },
    },
    {
      label: "Configurações",
      action: () => {
        setOpen(false);
        if (user?.role === "ADMIN") {
          navigate("/admin/settings");
        } else {
          // Send regular clients to their own settings/profile page
          navigate("/settings");
        }
      },
    },
    {
      label: "Sair",
      action: async () => {
        setOpen(false);
        try {
          await signOut();
          navigate("/admin/login", { replace: true });
        } catch (error) {
          console.error("Falha ao encerrar sessão.", error);
          toast.error("Não foi possível encerrar a sessão.");
        }
      },
    },
  ];

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (open && anchorEl && anchorEl.contains(event.target as Node)) {
      return;
    }

    setOpen(false);
    setAnchorEl(null);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <HeaderUserInfo user={user} />
      <IconButton
        aria-controls={open ? "composition-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <UserAvatar name={user.name} src={user.avatarUrl} size={30} />
      </IconButton>
      <HeaderPopoverMenu
        user={user}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={menuConfig[0].action}>
          <ListItemIcon>
            <PackageOpen size={18} />
          </ListItemIcon>
          {menuConfig[0].label}
        </MenuItem>
        <MenuItem onClick={menuConfig[1].action}>
          <ListItemIcon>
            <Settings size={18} />
          </ListItemIcon>
          {menuConfig[1].label}
        </MenuItem>
        <MenuItem onClick={menuConfig[2].action}>
          <ListItemIcon>
            <LogOut size={18} />
          </ListItemIcon>
          {menuConfig[2].label}
        </MenuItem>

        {children}
      </HeaderPopoverMenu>
    </Stack>
  );
}
