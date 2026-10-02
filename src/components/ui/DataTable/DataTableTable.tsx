import { Box, Stack, Typography, useTheme, alpha } from "@mui/material";
import { type GridColDef, DataGrid } from "@mui/x-data-grid";
import { SVG } from "../SVG";

interface DataTableProps<T> {
  columns: GridColDef[];
  data?: T[];
  checkboxSelection?: boolean;
  height?: number | string;
  disableRowSelectionOnClick?: boolean;
  loading?: boolean;
  filterModel?: {
    items: any[];
    quickFilterValues: any[];
  };
}

export default function DataTableTable<T>({
  data = [],
  columns,
  checkboxSelection,
  disableRowSelectionOnClick = true,
  loading = false,
  filterModel,
}: DataTableProps<T>) {
  const theme = useTheme();

  if (!loading && !data?.length) {
    return (
      <Stack
        justifyContent={"center"}
        height={"400px"}
        alignItems={"center"}
        spacing={2}
        border={"1px solid"}
        borderColor={"divider"}
        borderRadius={"8px"}
        p={8}
      >
        <SVG.NoData />
        <Typography variant="subtitle1" textAlign={"center"}>
          Não existem informações para serem exibidas no momento.
        </Typography>
      </Stack>
    );
  }

  const actionCol = columns.find((c) => c.field === "id");
  const otherCols = columns.filter((c) => c.field !== "id");

  if (otherCols.length > 0) {
    const lastIndex = otherCols.length - 1;
    otherCols[lastIndex] = { ...otherCols[lastIndex], flex: 1 };
  }

  const fixedColumns = actionCol
    ? [
        ...otherCols,
        {
          ...actionCol,
          cellClassName: "column-actions",
          headerClassName: "column-actions-header",
        },
      ]
    : otherCols;

  return (
    <Box
      sx={{
        height: "100%", 
        minWidth: 0,
        overflowX: "auto",
        overflowY: "auto",
      }}
    >
      <DataGrid
        sx={{
          border: "none",
          height: "100%",
          minHeight: "400px",
          "--DataGrid-rowBorderColor": "transparent",
          "& .MuiDataGrid-row": {
            borderBottom: `1px solid ${theme.palette.divider}`,
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
              transform: "scale(1.001)",
              zIndex: 1,
            },
            "&.Mui-selected": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
              },
            },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            "&:focus": {
              outline: "none",
            },
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: alpha(theme.palette.background.default, 0.5),
            borderBottom: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.secondary,
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          },
          "& .MuiDataGrid-columnHeader": {
            "&:focus": {
              outline: "none",
            },
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .column-actions": {
            position: "sticky",
            right: 0,
            zIndex: 1,
            backgroundColor: "inherit",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          },
          "& .column-actions-header": {
            position: "sticky",
            right: 0,
            zIndex: 3,
            alignItems: "center",
            justifyContent: "center",
          },
        }}
        rows={data}
        columns={fixedColumns}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        loading={loading}
        hideFooter
        rowHeight={52}
        filterModel={filterModel}
      />
    </Box>
  );
}
