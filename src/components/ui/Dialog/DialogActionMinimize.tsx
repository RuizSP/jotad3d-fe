import { IconButton } from "@mui/material";
import { CircleMinus } from "lucide-react";

interface DialogActionMinimizeProps {
  onMinimize: () => void;
}

export default function DialogActionMinimize(props: DialogActionMinimizeProps) {
  const { onMinimize } = props;
  return (
    <IconButton size="small" onClick={onMinimize}>
      <CircleMinus size={20} />
    </IconButton>
  );
}
