import { MenuItem, TextField } from "@mui/material";
import * as themes from "../../../themes";
import { useThemeToggle } from "../../../providers/ThemeToggleContext";

const themeLabels: Record<string, string> = {
  elegantGold: "Dourado (Light)",
  darkElegance: "Elegance (Dark)",
};

export default function ThemeSwitch() {
  const { setTheme, themeName } = useThemeToggle();

  function handleChange(name: string) {
    setTheme(name as keyof typeof themes);
  }

  return (
    <TextField
      name="theme-switch"
      label="Tema"
      select
      size="small"
      value={themeName || "elegantGold"}
      onChange={(e) => handleChange(e.target.value)}
      sx={{ minWidth: 150 }}
    >
      {Object.entries(themes).map(([name]) => (
        <MenuItem key={name} value={name}>
          {themeLabels[name] || name}
        </MenuItem>
      ))}
    </TextField>
  );
}
