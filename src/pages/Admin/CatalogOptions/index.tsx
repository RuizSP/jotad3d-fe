import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Pencil, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { Page } from "../../../components/ui/Page";
import { useCatalogOptions, useSaveCatalogOption } from "../../../hooks/useCatalogOptions";
import type { CatalogKind, CatalogOption } from "../../../shared/interfaces/CatalogOption";

const sections: { kind: CatalogKind; title: string; description: string }[] = [
  { kind: "categories", title: "Categorias", description: "Opções do cadastro de produtos e do catálogo." },
  { kind: "colors", title: "Cores", description: "Cores de filamento e suas amostras visuais." },
  { kind: "materials", title: "Materiais", description: "Opções de material e adicional cobrado na loja." },
];

function OptionSection({ kind, title, description }: (typeof sections)[number]) {
  const { data: options = [], isPending, error } = useCatalogOptions(kind);
  const save = useSaveCatalogOption(kind);
  const [editing, setEditing] = useState<Partial<CatalogOption> | null>(null);
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#888888");
  const [additionalPrice, setAdditionalPrice] = useState("0");

  const openForm = (option?: CatalogOption) => {
    setEditing(option || {});
    setName(option?.name || "");
    setHex(option?.hex || "#888888");
    setAdditionalPrice(String(option?.additionalPrice ?? 0));
  };

  const submit = async () => {
    if (!name.trim()) return toast.error("Informe um nome.");
    if (kind === "categories" && name.trim().toLowerCase() === "todos") return toast.error("'Todos' é reservado para o filtro do catálogo.");
    if (kind === "colors" && name.trim().toLowerCase() === "pintada") return toast.error("'Pintada' é reservado para as fotos de pintura.");
    if (kind === "colors" && !/^#[0-9a-f]{6}$/i.test(hex)) return toast.error("Informe uma cor hexadecimal válida.");
    if (kind === "materials" && (!Number.isFinite(Number(additionalPrice)) || Number(additionalPrice) < 0)) return toast.error("Informe um adicional válido.");
    try {
      await save.mutateAsync({ id: editing?.id, name, hex, additionalPrice: Number(additionalPrice), active: editing?.active ?? true });
      setEditing(null);
      toast.success("Opção salva.");
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Não foi possível salvar a opção.");
    }
  };

  const toggleActive = async (option: CatalogOption) => {
    try {
      await save.mutateAsync({ ...option, active: !option.active });
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Não foi possível alterar a opção.");
    }
  };

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
          <Typography variant="h6">{title}</Typography>
          <Button size="small" startIcon={<Plus size={16} />} onClick={() => openForm()}>Adicionar</Button>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2}>{description}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>Não foi possível carregar {title.toLowerCase()}.</Alert>}
        {isPending && <Typography variant="body2">Carregando...</Typography>}
        <Stack spacing={1}>
          {options.map((option) => (
            <Stack key={option.id} direction="row" alignItems="center" gap={1} sx={{ py: 0.5, borderBottom: "1px solid", borderColor: "divider" }}>
              {kind === "colors" && <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: option.hex, border: "1px solid", borderColor: "divider" }} />}
              <Box flex={1} minWidth={0}>
                <Typography variant="body2" fontWeight={600}>{option.name}</Typography>
                {kind === "materials" && <Typography variant="caption" color="text.secondary">+ R$ {(option.additionalPrice ?? 0).toFixed(2)}</Typography>}
              </Box>
              <Chip label={option.active ? "Ativo" : "Inativo"} size="small" color={option.active ? "success" : "default"} onClick={() => toggleActive(option)} disabled={save.isPending} />
              <IconButton size="small" aria-label={`Editar ${option.name}`} onClick={() => openForm(option)}><Pencil size={16} /></IconButton>
            </Stack>
          ))}
        </Stack>
      </CardContent>
      <Dialog open={editing !== null} onClose={() => setEditing(null)} fullWidth maxWidth="xs">
        <DialogTitle>{editing?.id ? `Editar ${title.toLowerCase()}` : `Adicionar ${title.toLowerCase()}`}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            <TextField label="Nome" value={name} onChange={(event) => setName(event.target.value)} autoFocus fullWidth />
            {kind === "colors" && <TextField label="Cor" type="color" value={hex} onChange={(event) => setHex(event.target.value)} fullWidth />}
            {kind === "materials" && <TextField label="Adicional na loja (R$)" type="number" value={additionalPrice} onChange={(event) => setAdditionalPrice(event.target.value)} slotProps={{ htmlInput: { min: 0, step: 0.01 } }} fullWidth />}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancelar</Button>
          <Button onClick={submit} variant="contained" disabled={save.isPending}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default function CatalogOptions() {
  return (
    <Page.Root>
      <Page.Content>
        <Typography variant="h4" fontWeight={800} mb={1}>Opções do catálogo</Typography>
        <Typography color="text.secondary" mb={3}>Cadastre categorias, cores e materiais. Desative uma opção para impedir novas escolhas sem perder o histórico.</Typography>
        <Grid container spacing={2}>
          {sections.map((section) => <Grid key={section.kind} size={{ xs: 12, md: 4 }}><OptionSection {...section} /></Grid>)}
        </Grid>
      </Page.Content>
    </Page.Root>
  );
}
