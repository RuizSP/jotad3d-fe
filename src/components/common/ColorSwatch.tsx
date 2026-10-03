import { Box, Tooltip } from "@mui/material";
import { useCatalogOptions } from "../../hooks/useCatalogOptions";

interface ColorSwatchProps {
  colorName: string;
  selected?: boolean;
  size?: number;
  onClick?: () => void;
}

export default function ColorSwatch({
  colorName,
  selected = false,
  size = 20,
  onClick,
}: ColorSwatchProps) {
  const { data: colors = [] } = useCatalogOptions("colors");
  const match = colors.find(
    (c) => c.name.toLowerCase() === colorName.toLowerCase()
  );
  const hex = match?.hex || "#888888";

  return (
    <Tooltip title={colorName} arrow>
      <Box
        component={onClick ? "button" : "span"}
        type={onClick ? "button" : undefined}
        onClick={onClick}
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: hex,
          display: "inline-block",
          border: selected ? "2px solid #D4AF37" : "1px solid rgba(0,0,0,0.15)",
          boxShadow: selected ? "0 0 0 2px rgba(212,175,55,0.4)" : "none",
          cursor: onClick ? "pointer" : "default",
          outline: "none",
          padding: 0,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&:hover": onClick
            ? {
                transform: "scale(1.2)",
              }
            : undefined,
        }}
      />
    </Tooltip>
  );
}
