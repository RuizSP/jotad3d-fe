import { useState } from "react";

export function usePagination(initialPage = 0, initialPerPage = 10) {
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    page,
    perPage,
    handleChangePage,
    handleChangeRowsPerPage,
    setPage,
    setPerPage,
  };
}
