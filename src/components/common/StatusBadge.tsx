import { Chip } from "@mui/material";
import type { OrderStatus } from "../../shared/interfaces/Order";

interface StatusBadgeProps {
  status: OrderStatus;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"; bgcolor?: string; textColor?: string }> = {
  recebido: { label: "Recebido", color: "default" },
  confirmacao: { label: "Confirmação", color: "warning" },
  producao: { label: "Em Produção", color: "info", bgcolor: "#1976D2", textColor: "#FFFFFF" },
  impressao_concluida: { label: "Impressão Concluída", color: "primary", bgcolor: "#D4AF37", textColor: "#0A0A0A" },
  acabamento: { label: "Em Acabamento", color: "secondary", bgcolor: "#9C27B0", textColor: "#FFFFFF" },
  pronto: { label: "Pronto para Envio", color: "success", bgcolor: "#2E7D32", textColor: "#FFFFFF" },
  finalizado: { label: "Finalizado", color: "success" },
  cancelado: { label: "Cancelado", color: "error" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, color: "default" };

  return (
    <Chip
      size="small"
      label={config.label}
      color={config.color}
      sx={{
        fontWeight: 700,
        fontSize: "0.75rem",
        letterSpacing: "0.03em",
        borderRadius: "9999px",
        bgcolor: config.bgcolor,
        color: config.textColor,
      }}
    />
  );
}
