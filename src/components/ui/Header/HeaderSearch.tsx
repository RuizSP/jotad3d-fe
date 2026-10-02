import { Box, InputAdornment, TextField } from "@mui/material";
import { Search } from "lucide-react";

interface HeaderSearchProps {
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => void;

  placeholder?: string;
}

export default function HeaderSearch(props: HeaderSearchProps) {
  const { onChange, placeholder = "Buscar...", value } = props;

  return (
    <Box sx={{ flex: 1, maxWidth: 420, mx: 2 }}>
      <TextField
        fullWidth
        placeholder={placeholder}
        variant="outlined"
        size="small"
        value={value}
        onChange={onChange}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search width={16} height={16} />
              </InputAdornment>
            ),
            sx: { borderRadius: "16px" },
          },
        }}
      />
    </Box>
  );
}
