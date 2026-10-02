import type { DialogProps } from "@toolpad/core";
import { Dialog } from "../../ui/Dialog";
import { useAppToolbar } from "../../../providers";

export default function DashboardDialog(props: DialogProps<any, any>) {
  const { onClose, open, payload } = props;
  function handleSubmit() {
    onClose(undefined);
  }

  const { addDialog } = useAppToolbar();

  return (
    <Dialog.Root open={open} onClose={onClose}>
      <Dialog.Header>
        <Dialog.Title title="Teste" />
        <Dialog.HeaderActions>
          <Dialog.ActionMinimize
            onMinimize={() => {
              addDialog({
                id: "dashboard-dialog",
                module: "Dashboard/DashboardDialog",
                payload,
                title: "dashboard",
              });
              onClose(undefined);
            }}
          />
          <Dialog.ActionClose onClose={onClose} />
        </Dialog.HeaderActions>
      </Dialog.Header>

      <Dialog.Content>
        <></>
      </Dialog.Content>

      <Dialog.Footer>
        <Dialog.FooterActions>
          <Dialog.ActionCancel onCancel={onClose} />
          <Dialog.ActionSubmit onSubmit={handleSubmit} />
        </Dialog.FooterActions>
      </Dialog.Footer>
    </Dialog.Root>
  );
}
