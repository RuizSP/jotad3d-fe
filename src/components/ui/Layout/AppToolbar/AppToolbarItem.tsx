import { Chip } from "@mui/material";
import { useDialogs, type DialogComponent } from "@toolpad/core";
import { FileText, X } from "lucide-react";
import { useAppToolbar } from "../../../../providers";

const dialogModules = import.meta.glob("../../../application/**/*.tsx");

interface AppToolbarItemProps {
  dialog: {
    id: string;
    module: string;
    payload: object;
    title: string;
  };
}

export function AppToolbarItem({ dialog }: AppToolbarItemProps) {
  const dialogs = useDialogs();
  const { removeDialog } = useAppToolbar();

  async function handleOpen() {
    const modulePath = `../../../application/${dialog.module}.tsx`;

    const importer = dialogModules[modulePath];

    if (!importer) {
      console.warn(`Dialog module "${dialog.module}" não encontrado.`);
      return;
    }

    const loadedModule = (await importer()) as {
      default: DialogComponent<object, unknown>;
    };
    const Component = loadedModule.default;

    dialogs.open(Component, dialog.payload);
  }

  return (
    <Chip
      icon={<FileText size={16} />}
      onClick={handleOpen}
      label={dialog.title}
      onDelete={() => removeDialog(dialog.id)}
      deleteIcon={<X size={16} />}
      color="secondary"
      sx={{
        fontWeight: 600,
        fontSize: "0.875rem",
        px: 1.5,
        py: 2.5,
        borderRadius: 2,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "& .MuiChip-icon": {
          color: "#ffffff",
          marginLeft: 1,
        },
        "& .MuiChip-deleteIcon": {
          color: "rgba(255, 255, 255, 0.8)",
          transition: "all 0.2s ease",
          "&:hover": {
            color: "#ffffff",
            transform: "scale(1.1)",
          },
        },
        "&:active": {
          transform: "translateY(0)",
        },
      }}
    />
  );
}
