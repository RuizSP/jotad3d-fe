import { Stack, TextField } from "@mui/material";
import type { DialogProps } from "@toolpad/core";
import { useEffect } from "react";
import * as Yup from "yup";
import { Dialog } from "../../ui/Dialog";
import { useForm } from "../../../hooks/useForm";
import { useAppToolbar } from "../../../providers";

interface ClienteFormData {
  nome: string;
  sobrenome: string;
}

export default function Form(props: DialogProps<ClienteFormData, undefined>) {
  const { onClose, open, payload } = props;
  async function handleSubmit() {
    try {
      const isValid = await validation();
      if (!isValid) return;
      clearErrors();
      onClose(undefined);
    } catch (err) {
      console.log(err);
    }
  }

  const {
    data,
    setData,
    changeValue,
    validation,
    validationErrors,
    clearErrors,
  } = useForm({
    initialValues: payload,
    schema: Yup.object({
      nome: Yup.string().required("Nome é obrigatório"),
      sobrenome: Yup.string().required("Sobrenome é obrigatório"),
    }),
  });

  useEffect(() => {
    if (payload) {
      setData(payload);
    }
  }, [payload, setData]);

  const { addDialog } = useAppToolbar();

  return (
    <Dialog.Root open={open} onClose={onClose}>
      <Dialog.Header>
        <Dialog.Title title="Teste" />
        <Dialog.HeaderActions>
          <Dialog.ActionMinimize
            onMinimize={() => {
              addDialog({
                id: "teste",
                module: "Cliente/Form",
                payload: data,
                title: "Teste",
              });
              onClose(undefined);
            }}
          />

          <Dialog.ActionClose onClose={onClose} />
        </Dialog.HeaderActions>
      </Dialog.Header>

      <Dialog.Content>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nome"
            fullWidth
            value={data.nome}
            onChange={(e) => changeValue("nome", e.target.value)}
            {...validationErrors("nome")}
          />
          <TextField
            label="Sobrenome"
            fullWidth
            value={data.sobrenome}
            onChange={(e) => changeValue("sobrenome", e.target.value)}
            {...validationErrors("sobrenome")}
          />
        </Stack>
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
