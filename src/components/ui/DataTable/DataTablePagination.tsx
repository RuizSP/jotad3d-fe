import {
  Pagination,
  Stack,
  TablePagination
} from "@mui/material";

interface DataTablePaginationProps {
  count: number;
  page: number;
  perPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowsPerPageOptions?: number[];
}

export default function DataTablePagination({
  count,
  page,
  perPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
}: DataTablePaginationProps) {
  const pageCount = Math.ceil(count / perPage);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      spacing={2}
    >
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={perPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
        labelRowsPerPage="Linhas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `Exibindo ${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
      />
      

      <Pagination
        count={pageCount}
        page={page + 1} // Pagination is 1-based, our state is 0-based
        onChange={(_e, newPage) => onPageChange(_e, newPage - 1)} // Convert back to 0-based
        shape="rounded"
        color="primary"
        showFirstButton
        showLastButton
      />
    </Stack>
  );
}
