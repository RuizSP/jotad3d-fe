import { Stack, Popover } from "@mui/material";
import { useState } from "react";
import { SidebarNavItem } from "./SidebarNavItem";
import type { MenuItem } from "../../../shared/interfaces/MenuItem";

interface SidebarNavProps {
  items: MenuItem[];
  collapsed: boolean;
  activeId?: string;
  onSelect: (item: MenuItem) => void;
}

export function SidebarNav({
  items,
  collapsed,
  activeId,
  onSelect,
}: SidebarNavProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverItems, setPopoverItems] = useState<MenuItem[] | null>(null);

  function handleClickItem(
    item: MenuItem,
    event?: React.MouseEvent<HTMLElement>,
  ) {
    if (item.items?.length) {
      if (collapsed && event) {
        setAnchorEl(event.currentTarget);
        setPopoverItems(item.items);
        return;
      }

      setOpenItemId((prev) => (prev === item.id ? null : item.id));
      return;
    }

    onSelect(item);
    setAnchorEl(null);
    setPopoverItems(null);
  }

  function renderItems(items: MenuItem[], level = 0) {
    return (
      <Stack spacing={1}>
        {items.map((item) => {
          const isOpen = openItemId === item.id;

          return (
            <div key={item.id}>
              <SidebarNavItem
                item={item}
                collapsed={collapsed}
                active={item.id === activeId}
                open={!collapsed && isOpen}
                onClick={handleClickItem}
              />

              {!collapsed && item.items && isOpen && (
                <Stack spacing={1} pl={2}>
                  {renderItems(item.items, level + 1)}
                </Stack>
              )}
            </div>
          );
        })}
      </Stack>
    );
  }

  return (
    <>
      {renderItems(items)}

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
          setPopoverItems(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            p: 1,
            minWidth: 200,
          },
        }}
      >
        {popoverItems && (
          <Stack spacing={1}>
            {popoverItems.map((subItem) => (
              <SidebarNavItem
                key={subItem.id}
                item={subItem}
                collapsed={false}
                active={subItem.id === activeId}
                onClick={(item) => {
                  onSelect(item);
                  setAnchorEl(null);
                  setPopoverItems(null);
                }}
              />
            ))}
          </Stack>
        )}
      </Popover>
    </>
  );
}
