import { IconButton } from "@mui/material";
import { Trash2 } from "lucide-react";

export default function DataTableDeleteButton<T>({ data }: { data: T }) {
  const handleClick = (event: "edit" | "delete", rowData: T) => {
    return { event, rowData };
  };

  return (
    <IconButton color="primary" onClick={() => handleClick("delete", data)}>
      <Trash2 size={16} />
    </IconButton>
  );
}
