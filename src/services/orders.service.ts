import { supabase } from "./supabase";
import type {
  DeliveryMethod,
  Order,
  OrderStatus,
} from "../shared/interfaces/Order";

interface SupabaseOrderItemRow {
  produto_id: string | number | null;
  produtos?: { nome: string | null; imagem_url: string | null } | null;
  quantidade: number;
  preco_unitario: number | string;
  cor_escolhida: string | null;
}

interface SupabaseOrderRow {
  id: string | number;
  access_code: string | null;
  order_number: number | null;
  status: OrderStatus | null;
  delivery_method?: DeliveryMethod | null;
  concluido: boolean | null;
  pronto_para_entrega: boolean | null;
  cliente_nome: string;
  whatsapp?: string | null;
  email?: string | null;
  cep?: string | null;
  endereco?: string | null;
  numero?: string | null;
  bairro?: string | null;
  cidade: string | null;
  complemento?: string | null;
  pedido_itens?: SupabaseOrderItemRow[] | null;
  valor_total: number | string;
  pago: boolean | null;
  observacoes?: string | null;
  data_criacao: string | null;
}

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase não está configurado para persistir pedidos.");
  }
  return supabase;
};

const generateAccessCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "JD-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const mapOrder = (order: SupabaseOrderRow): Order => {
  const status =
    order.status ||
    (order.concluido
      ? "finalizado"
      : order.pronto_para_entrega
        ? "pronto"
        : "producao");

  return {
    id: String(order.id),
    accessCode:
      order.access_code ||
      `JD-${String(order.id).replaceAll("-", "").slice(0, 8).toUpperCase()}`,
    orderNumber: Number(order.order_number),
    customerName: order.cliente_nome,
    whatsapp: order.whatsapp || "",
    email: order.email || "",
    items: (order.pedido_itens || []).map((item) => ({
      productId: String(item.produto_id ?? ""),
      productName: item.produtos?.nome || "Peça 3D",
      imageUrl: item.produtos?.imagem_url || "",
      quantity: item.quantidade,
      unitPrice: Number(item.preco_unitario),
      color: item.cor_escolhida || "Preto",
    })),
    totalAmount: Number(order.valor_total),
    status,
    paid: Boolean(order.pago),
    notes: order.observacoes || "",
    createdAt: order.data_criacao || "",
    deliveryMethod: order.delivery_method || "delivery",
    address:
      order.delivery_method === "pickup"
        ? null
        : {
            cep: order.cep || "",
            rua: order.endereco || "",
            numero: order.numero || "",
            bairro: order.bairro || "",
            cidade: order.cidade || "",
            complemento: order.complemento || "",
          },
  };
};

export const ordersService = {
  async getAll(): Promise<Order[]> {
    const { data, error } = await requireSupabase()
      .from("pedidos")
      .select("*, pedido_itens(*, produtos(*))")
      .order("data_criacao", { ascending: false });

    if (error) throw error;
    return ((data || []) as SupabaseOrderRow[]).map(mapOrder);
  },

  async create(
    orderInput: Omit<
      Order,
      "id" | "accessCode" | "orderNumber" | "createdAt" | "status" | "paid"
    >,
  ): Promise<Order> {
    const accessCode = generateAccessCode();
    const client = requireSupabase();
    const { data: insertedOrder, error: orderError } = await client
      .from("pedidos")
      .insert({
        access_code: accessCode,
        status: "recebido",
        delivery_method: orderInput.deliveryMethod,
        cliente_nome: orderInput.customerName,
        whatsapp: orderInput.whatsapp,
        email: orderInput.email || null,
        cep: orderInput.address?.cep || null,
        endereco: orderInput.address?.rua || null,
        numero: orderInput.address?.numero || null,
        bairro: orderInput.address?.bairro || null,
        cidade: orderInput.address?.cidade || "Retirada na loja",
        complemento: orderInput.address?.complemento || null,
        valor_total: orderInput.totalAmount,
        pago: false,
        pronto_para_entrega: false,
        concluido: false,
        observacoes: orderInput.notes || null,
      })
      .select("id, access_code, order_number, status, data_criacao")
      .single();

    if (orderError) throw orderError;
    if (!insertedOrder)
      throw new Error("O Supabase não retornou o pedido criado.");

    if (orderInput.items.length > 0) {
      const itemsToInsert = orderInput.items.map((item) => ({
        pedido_id: insertedOrder.id,
        produto_id: item.productId.startsWith("3d-") ? null : item.productId,
        quantidade: item.quantity,
        preco_unitario: item.unitPrice,
        cor_escolhida: item.color || "Padrão",
      }));
      const { error: itemsError } = await client
        .from("pedido_itens")
        .insert(itemsToInsert);

      if (itemsError) {
        const { error: rollbackError } = await client
          .from("pedidos")
          .delete()
          .eq("id", insertedOrder.id);
        if (rollbackError) {
          console.error("Falha ao remover pedido incompleto.", rollbackError);
        }
        throw itemsError;
      }
    }

    return {
      ...orderInput,
      id: String(insertedOrder.id),
      accessCode: insertedOrder.access_code,
      orderNumber: Number(insertedOrder.order_number),
      createdAt: insertedOrder.data_criacao,
      status: insertedOrder.status as OrderStatus,
      paid: false,
    };
  },

  async updateStatus(
    id: string,
    status: OrderStatus,
    paid?: boolean,
    notes?: string,
  ): Promise<boolean> {
    const patch: Record<string, unknown> = {
      status,
      pronto_para_entrega: status === "pronto" || status === "finalizado",
      concluido: status === "finalizado",
    };
    if (paid !== undefined) patch.pago = paid;
    if (notes !== undefined) patch.observacoes = notes;

    const { data, error } = await requireSupabase()
      .from("pedidos")
      .update(patch)
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    return Boolean(data);
  },

  async getByCodeOrNumber(query: string): Promise<Order | null> {
    const cleanQuery = query.trim().toUpperCase();
    const safeQuery = cleanQuery.replace(/[^A-Z0-9-]/g, "");
    const filters = [`access_code.eq.${safeQuery}`];
    if (/^\d+$/.test(cleanQuery)) {
      filters.push(`order_number.eq.${Number(cleanQuery)}`);
    }
    if (/^[0-9A-F-]{36}$/.test(cleanQuery)) {
      filters.push(`id.eq.${cleanQuery}`);
    }

    const { data, error } = await requireSupabase()
      .from("pedidos")
      .select("*, pedido_itens(*, produtos(*))")
      .or(filters.join(","))
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data ? mapOrder(data as SupabaseOrderRow) : null;
  },

  buildWhatsAppMessage(order: Order, companyNumber: string): string {
    const cleanPhone = companyNumber.replace(/\D/g, "");
    const receivingDetails =
      order.deliveryMethod === "pickup"
        ? `*Recebimento:* Retirada no endereço da loja. O endereço será combinado pelo WhatsApp.%0A%0A`
        : `*Endereço de Entrega:*%0A${order.address?.rua}, ${order.address?.numero}${order.address?.complemento ? ` (${order.address.complemento})` : ""} - ${order.address?.bairro}%0A${order.address?.cidade} - CEP: ${order.address?.cep}%0A%0A`;
    const itemsList = order.items
      .map(
        (i) =>
          `• ${i.quantity}x ${i.productName} (${i.color || "Cor Padrão"}) - R$ ${(i.unitPrice * i.quantity).toFixed(2)}`,
      )
      .join("%0A");

    const text =
      `*Olá, JOTAD3D! Realizei um novo pedido pelo site:*%0A%0A` +
      `*Código de Acompanhamento:* ${order.accessCode}%0A` +
      `*Número do Pedido:* #${order.orderNumber}%0A` +
      `*Cliente:* ${order.customerName}%0A` +
      `*WhatsApp:* ${order.whatsapp}%0A%0A` +
      `*Itens:*%0A${itemsList}%0A%0A` +
      receivingDetails +
      `*Valor Total:* R$ ${order.totalAmount.toFixed(2)}%0A%0A` +
      `Gostaria de confirmar o pedido e combinar o pagamento!`;

    return `https://wa.me/${cleanPhone}?text=${text}`;
  },

  buildCustomQuoteUrl(
    companyNumber: string,
    details: {
      name: string;
      whatsapp: string;
      description: string;
      color?: string;
      dimensions?: string;
      fileName?: string;
      fileSize?: string;
    },
  ): string {
    const cleanPhone = companyNumber.replace(/\D/g, "");
    const text =
      `*Olá, JOTAD3D! Gostaria de um orçamento para peça personalizada:*%0A%0A` +
      `*Nome:* ${details.name}%0A` +
      `*WhatsApp:* ${details.whatsapp}%0A` +
      `*Descrição da Peça:* ${details.description}%0A` +
      (details.color ? `*Cor Preferida:* ${details.color}%0A` : "") +
      (details.dimensions
        ? `*Dimensões Estimadas:* ${details.dimensions}%0A`
        : "") +
      (details.fileName
        ? `*Arquivo 3D / Imagem:* ${details.fileName} (${details.fileSize || ""})%0A`
        : "") +
      `%0AEnvio em seguida o arquivo ou fotos para análise!`;

    return `https://wa.me/${cleanPhone}?text=${text}`;
  },
};
