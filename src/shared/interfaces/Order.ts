export type OrderStatus =
  | "recebido"
  | "confirmacao"
  | "producao"
  | "impressao_concluida"
  | "acabamento"
  | "pronto"
  | "finalizado"
  | "cancelado";

export interface OrderStatusStep {
  key: OrderStatus;
  label: string;
  description: string;
}

export const ORDER_STATUS_STEPS: OrderStatusStep[] = [
  {
    key: "recebido",
    label: "Pedido Recebido",
    description: "Seu pedido foi registrado em nossa fila.",
  },
  {
    key: "confirmacao",
    label: "Aguardando Confirmação",
    description: "Aguardando confirmação e triagem técnica.",
  },
  {
    key: "producao",
    label: "Em Produção",
    description: "Peça sendo impressa em filamento 3D.",
  },
  {
    key: "impressao_concluida",
    label: "Impressão Concluída",
    description: "Impressão concluída, aguardando pós-processamento.",
  },
  {
    key: "acabamento",
    label: "Em Acabamento",
    description: "Remoção de suportes, cura e polimento estético.",
  },
  {
    key: "pronto",
    label: "Pronto para Retirada/Envio",
    description: "Peça pronta, aguardando coleta ou despacho.",
  },
  {
    key: "finalizado",
    label: "Finalizado",
    description: "Pedido entregue com sucesso.",
  },
  { key: "cancelado", label: "Cancelado", description: "Pedido cancelado." },
];

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  color?: string;
}

export interface DeliveryAddress {
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado?: string;
  complemento?: string;
}

export type DeliveryMethod = "delivery" | "pickup";

export interface Order {
  id: string;
  accessCode: string;
  orderNumber: number;
  customerName: string;
  whatsapp: string;
  email?: string;
  deliveryMethod: DeliveryMethod;
  address: DeliveryAddress | null;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paid: boolean;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}
