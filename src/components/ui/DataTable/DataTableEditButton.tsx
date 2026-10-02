import { IconButton } from "@mui/material";
import { Edit2 } from "lucide-react";

interface DataTableEditButtonProps {
  onClick?: () => void;
}

export default function DataTableEditButton({
  onClick,
}: DataTableEditButtonProps) {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <IconButton color="primary" onClick={() => handleClick()}>
      <Edit2 size={16} />
    </IconButton>
  );
}
