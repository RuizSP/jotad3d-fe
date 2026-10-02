import {
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { debounce } from "lodash";

import { useCallback, useMemo } from "react";

import type { BaseFilterType } from "./Type/BaseFilterType";

import { Search, X } from "lucide-react";
import { useFilter, useFilterApi } from "../../../providers";

export default function FilterSearchBar() {
  const { filterValues } = useFilter<BaseFilterType>();
  const { changeFilterValue, applyFilterValue } =
    useFilterApi<BaseFilterType>();

  const debouncedApplyFilter = useMemo(
    () =>
      debounce((value: string) => {
        applyFilterValue("query", value);
      }, 500),
    [applyFilterValue],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      changeFilterValue("query", value);
      debouncedApplyFilter(value);
    },
    [changeFilterValue, debouncedApplyFilter],
  );

  function handleResetQuery() {
    changeFilterValue("query", "");
    applyFilterValue("query", "");
    debouncedApplyFilter.cancel();
  }

  const handleBlur = () => {
    debouncedApplyFilter.flush(); 
  };

  return (
    <TextField
      fullWidth
      value={filterValues?.query || ""}
      autoFocus
      size="small" 
      placeholder="Pesquisar"
      variant="standard"
      onChange={handleChange}
      onBlur={handleBlur}
      InputProps={{
        disableUnderline: true, 
        startAdornment: (
          <InputAdornment position="start">
            <Stack spacing={1} direction={"row"}>
              {filterValues?.query ? (
                <IconButton onClick={handleResetQuery} title="Limpar pesquisa">
                  <X size={16}/>
                </IconButton>
              ) : (
                <Search size={16}/>
              )}
              <Divider orientation="vertical" flexItem />
            </Stack>
          </InputAdornment>
        ),
      }}
      sx={{
        backgroundColor: "transparent", 
        "& .MuiInputBase-root": {
          border: "none",
          boxShadow: "none",
        },
        "& .MuiInputBase-root:before": {
          borderBottom: "none",
        },
        "& .MuiInputBase-root:after": {
          borderBottom: "none",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
      }}
    />
  );
}
