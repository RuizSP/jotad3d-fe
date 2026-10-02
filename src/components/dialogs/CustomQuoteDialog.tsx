import { useState, useRef } from "react";
import * as Yup from "yup";
import {
  TextField,
  Stack,
  Box,
  MenuItem,
  Alert,
  Button,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import { MessageSquareShare, UploadCloud, FileCode2, X } from "lucide-react";
import { useForm } from "../../hooks/useForm";
import { ordersService } from "../../services/orders.service";
import { Dialog } from "../ui/Dialog";
import { PRODUCT_COLORS } from "../../shared/interfaces/Product";

interface CustomQuoteDialogProps {
  open: boolean;
  onClose: () => void;
}

interface CustomQuoteFormData {
  name: string;
  whatsapp: string;
  description: string;
  color: string;
  dimensions: string;
}

const customQuoteSchema = Yup.object().shape({
  name: Yup.string().required("Informe seu nome").min(3, "Mínimo de 3 caracteres"),
  whatsapp: Yup.string().required("Informe seu WhatsApp").min(8, "Telefone inválido"),
  description: Yup.string().required("Descreva a peça ou ideia").min(10, "Mínimo de 10 caracteres"),
  color: Yup.string(),
  dimensions: Yup.string(),
});

export default function CustomQuoteDialog({
  open,
  onClose,
}: CustomQuoteDialogProps) {
  const companyPhone = import.meta.env.VITE_COMPANY_WHATSAPP || "5511999999999";
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data,
    changeValue,
    validation,
    validationErrors,
    clearErrors,
  } = useForm<CustomQuoteFormData>({
    initialValues: {
      name: "",
      whatsapp: "",
      description: "",
      color: "Preto",
      dimensions: "",
    },
    schema: customQuoteSchema,
  });

  const formatSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const isValid = await validation();
    if (!isValid) return;

    const url = ordersService.buildCustomQuoteUrl(companyPhone, {
      name: data.name,
      whatsapp: data.whatsapp,
      description: data.description,
      color: data.color,
      dimensions: data.dimensions,
      fileName: attachedFile ? attachedFile.name : undefined,
      fileSize: attachedFile ? formatSize(attachedFile.size) : undefined,
    });

    window.open(url, "_blank");
    clearErrors();
    setAttachedFile(null);
    onClose();
  };

  return (
    <Dialog.Root open={open} onClose={async () => onClose()} maxWidth="sm">
      <Dialog.Header>
        <Dialog.Title title="Solicitar Orçamento Personalizado" />
        <Dialog.ActionClose onClose={async () => onClose()} />
      </Dialog.Header>

      <Dialog.Content>
        <Stack spacing={2.5}>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Tem um arquivo 3D (.STL, .OBJ, .STEP) ou uma ideia para modelar? Preencha os
            dados abaixo para enviar o orçamento direto para nosso WhatsApp.
          </Alert>

          <TextField
            label="Seu Nome *"
            value={data.name}
            onChange={(e) => changeValue("name", e.target.value)}
            {...validationErrors("name")}
          />

          <TextField
            label="Seu WhatsApp (com DDD) *"
            placeholder="(11) 99999-9999"
            value={data.whatsapp}
            onChange={(e) => changeValue("whatsapp", e.target.value)}
            {...validationErrors("whatsapp")}
          />

          <TextField
            label="Descrição da Peça / Ideia *"
            placeholder="Ex: Suporte para controle de videogame com logo customizado..."
            multiline
            rows={3}
            value={data.description}
            onChange={(e) => changeValue("description", e.target.value)}
            {...validationErrors("description")}
          />

          <Box display="flex" gap={2}>
            <TextField
              select
              label="Cor de Preferência"
              value={data.color}
              onChange={(e) => changeValue("color", e.target.value)}
              sx={{ flex: 1 }}
            >
              {PRODUCT_COLORS.map((col) => (
                <MenuItem key={col.name} value={col.name}>
                  {col.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Dimensões Estimadas"
              placeholder="Ex: 10 x 10 x 15 cm"
              value={data.dimensions}
              onChange={(e) => changeValue("dimensions", e.target.value)}
              sx={{ flex: 1 }}
            />
          </Box>

          <Box>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".stl,.obj,.step,.3mf,.zip,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />

            {!attachedFile ? (
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                startIcon={<UploadCloud size={20} />}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  borderRadius: "16px",
                  py: 1.5,
                  borderStyle: "dashed",
                  borderWidth: "1.5px",
                }}
              >
                Anexar Arquivo 3D ou Imagem (.STL, .OBJ, .STEP, .ZIP, .PNG)
              </Button>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "background.default",
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <FileCode2 size={24} color="#D4AF37" />
                  <Box>
                    <Typography variant="body2" fontWeight="700" noWrap sx={{ maxWidth: 280 }}>
                      {attachedFile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatSize(attachedFile.size)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setAttachedFile(null)}
                  sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                >
                  <X size={18} />
                </IconButton>
              </Paper>
            )}
          </Box>
        </Stack>
      </Dialog.Content>

      <Dialog.Footer>
        <Dialog.FooterActions>
          <Dialog.ActionCancel onClick={onClose}>Cancelar</Dialog.ActionCancel>
          <Dialog.ActionSubmit
            startIcon={<MessageSquareShare size={18} />}
            onClick={handleSubmit}
          >
            Enviar via WhatsApp
          </Dialog.ActionSubmit>
        </Dialog.FooterActions>
      </Dialog.Footer>
    </Dialog.Root>
  );
}
