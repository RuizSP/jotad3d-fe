import { useState, useEffect, useMemo, useCallback } from "react";
import { usePagination } from "../../../hooks/usePagination";
import { DataTable } from "../../ui/DataTable";
import type { GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Clock,
  Box as BoxIcon,
} from "lucide-react";
import { useDialogs } from "@toolpad/core";
import { productsService } from "../../../services/products.service";
import type { Product } from "../../../shared/interfaces/Product";
import ProductFormDialog from "../../dialogs/ProductFormDialog";
import ColorSwatch from "../../common/ColorSwatch";

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const dialogs = useDialogs();
  const { page, perPage, handleChangePage, handleChangeRowsPerPage } =
    usePagination();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productsService.getAll();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCreate = async () => {
    const created = await dialogs.open(ProductFormDialog, null);
    if (created) {
      loadProducts();
    }
  };

  const handleEdit = useCallback(
    async (product: Product) => {
      const updated = await dialogs.open(ProductFormDialog, product);
      if (updated) {
        loadProducts();
      }
    },
    [dialogs, loadProducts],
  );

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    setDeleting(true);
    try {
      await productsService.delete(deleteCandidate.id);
      setDeleteCandidate(null);
      await loadProducts();
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        (p.material && p.material.toLowerCase().includes(term)),
    );
  }, [products, searchTerm]);

  const columns = useMemo(
    (): GridColDef<Product>[] => [
      {
        field: "imageUrl",
        headerName: "Peça",
        width: 70,
        sortable: false,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" height="100%">
            <Avatar
              variant="rounded"
              src={params.value}
              alt={params.row.name}
              sx={{ width: 44, height: 44, bgcolor: "grey.200" }}
            >
              <BoxIcon size={20} />
            </Avatar>
          </Box>
        ),
      },
      {
        field: "name",
        headerName: "Nome da Peça",
        flex: 1.4,
        renderCell: (params) => (
          <Box display="flex" flexDirection="column" justifyContent="center">
            <Typography variant="body2" fontWeight="700">
              {params.row.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: 260 }}
            >
              {params.row.description || "Sem descrição"}
            </Typography>
          </Box>
        ),
      },
      {
        field: "category",
        headerName: "Categoria",
        flex: 1,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value}
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: "0.75rem" }}
          />
        ),
      },
      {
        field: "price",
        headerName: "Preço",
        flex: 0.9,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight="800" color="secondary.main">
            R$ {params.row.price.toFixed(2)}
          </Typography>
        ),
      },
      {
        field: "material",
        headerName: "Filamento",
        flex: 1,
        renderCell: (params) => (
          <Typography variant="caption" fontWeight="600" color="text.primary">
            {params.value || "PLA"}
          </Typography>
        ),
      },
      {
        field: "printTimeHours",
        headerName: "Tempo Est.",
        flex: 0.8,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            <Clock size={14} color="#888" />
            <Typography variant="caption">
              {params.value ? `${params.value}h` : "-"}
            </Typography>
          </Box>
        ),
      },
      {
        field: "availableColors",
        headerName: "Cores",
        flex: 1,
        sortable: false,
        renderCell: (params) => {
          const colors = params.row.availableColors || [];
          return (
            <Box display="flex" alignItems="center" gap={0.5} height="100%">
              {colors.slice(0, 4).map((c) => (
                <Tooltip key={c} title={c}>
                  <Box>
                    <ColorSwatch colorName={c} size={16} />
                  </Box>
                </Tooltip>
              ))}
              {colors.length > 4 && (
                <Typography variant="caption" color="text.secondary">
                  +{colors.length - 4}
                </Typography>
              )}
            </Box>
          );
        },
      },
      {
        field: "id",
        headerName: "Ações",
        type: "actions",
        flex: 0.8,
        renderCell: (params) => (
          <Box display="flex" gap={0.5}>
            <Tooltip title="Editar Peça">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleEdit(params.row)}
              >
                <Edit size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir Peça">
              <IconButton
                size="small"
                color="error"
                onClick={() => setDeleteCandidate(params.row)}
              >
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [handleEdit],
  );

  return (
    <>
      <DataTable.Root>
        <DataTable.Toolbar>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <DataTable.Title>Catálogo de Peças 3D</DataTable.Title>
            <TextField
              size="small"
              placeholder="Buscar por peça, categoria ou filamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ minWidth: 320 }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus size={18} />}
            onClick={handleCreate}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            Nova Peça
          </Button>
        </DataTable.Toolbar>
        <DataTable.Table
          columns={columns}
          data={filteredProducts}
          loading={loading}
        />
        <DataTable.Footer>
          <DataTable.Pagination
            count={filteredProducts.length}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            page={page}
            perPage={perPage}
          />
        </DataTable.Footer>
      </DataTable.Root>

      <MuiDialog
        open={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
      >
        <DialogTitle>Excluir Peça do Catálogo?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja remover permanentemente{" "}
            <strong>{deleteCandidate?.name}</strong> do catálogo de produtos?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCandidate(null)} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? "Excluindo..." : "Excluir Peça"}
          </Button>
        </DialogActions>
      </MuiDialog>
    </>
  );
}
