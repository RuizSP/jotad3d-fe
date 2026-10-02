import { IconButton } from "@mui/material";
import { Filter } from "lucide-react";
import { useOpenMenu } from "../../../providers/OpenMenuProvider";

export default function FilterActionOpenIcon() {
  const { toggleOpen } = useOpenMenu();
  return (
    <IconButton title="Filtros" onClick={toggleOpen}>
      <Filter size={16} />
    </IconButton>
  );
}
