import { supabase } from "./supabase";
import type {
  DeliveryMethod,
  Order,
  OrderStatus,
} from "../shared/interfaces/Order";
import {
  mapStoreLocation,
  type StoreLocationRow,
} from "./storeLocations.service";

interface SupabaseOrderItemRow {
  produto_id: string | number | null;
  produto_nome?: string | null;
  imagem_url?: string | null;
  produtos?: { nome: string | null; imagem_url: string | null } | null;
  quantidade: number;
  preco_unitario: number | string;
  cor_escolhida: string | null;
}

interface CreatedPublicOrderRow {
  id: string;
  access_code: string;
  order_number: number;
  status: OrderStatus;
  data_criacao: string;
  store_location: StoreLocationRow | null;
}

interface SupabaseOrderRow {
  id: string | number;
  access_code: string | null;
  order_number: number | null;
  status: OrderStatus | null;
  delivery_method?: DeliveryMethod | null;
  store_location_id?: string | null;
  store_location?: StoreLocationRow | null;
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
      productName: item.produto_nome || item.produtos?.nome || "Peça 3D",
      imageUrl: item.imagem_url || item.produtos?.imagem_url || "",
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
    storeLocationId: order.store_location_id || null,
    storeLocation: order.store_location
      ? mapStoreLocation(order.store_location)
      : null,
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
      .select(
        "*, pedido_itens(*, produtos(*)), store_location:store_locations(*)",
      )
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
    const { data, error } = await requireSupabase().rpc("create_public_order", {
      p_customer_name: orderInput.customerName,
      p_whatsapp: orderInput.whatsapp,
      p_email: orderInput.email || null,
      p_delivery_method: orderInput.deliveryMethod,
      p_store_location_id: orderInput.storeLocationId || null,
      p_cep: orderInput.address?.cep || null,
      p_address: orderInput.address?.rua || null,
      p_number: orderInput.address?.numero || null,
      p_neighborhood: orderInput.address?.bairro || null,
      p_city: orderInput.address?.cidade || null,
      p_complement: orderInput.address?.complemento || null,
      p_total_amount: orderInput.totalAmount,
      p_notes: orderInput.notes || null,
      p_items: orderInput.items,
    });

    if (error) throw error;
    if (!data || typeof data !== "object")
      throw new Error("O Supabase não retornou o pedido criado.");

    const insertedOrder = data as unknown as CreatedPublicOrderRow;

    return {
      ...orderInput,
      id: String(insertedOrder.id),
      accessCode: insertedOrder.access_code,
      orderNumber: Number(insertedOrder.order_number),
      createdAt: insertedOrder.data_criacao,
      status: insertedOrder.status as OrderStatus,
      paid: false,
      storeLocationId: orderInput.storeLocationId || null,
      storeLocation: insertedOrder.store_location
        ? mapStoreLocation(insertedOrder.store_location)
        : null,
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

  async getByAccessCode(accessCode: string): Promise<Order | null> {
    const safeCode = accessCode.trim().toUpperCase();
    if (!/^JD-[A-Z0-9]{8,12}$/.test(safeCode)) return null;

    const { data, error } = await requireSupabase().rpc(
      "get_public_order_tracking",
      { p_access_code: safeCode },
    );

    if (error) throw error;
    return data ? mapOrder(data as unknown as SupabaseOrderRow) : null;
  },

  buildWhatsAppMessage(order: Order, companyNumber: string): string {
    const cleanPhone = companyNumber.replace(/\D/g, "");
    const receivingDetails =
      order.deliveryMethod === "pickup"
        ? order.storeLocation
          ? `*Retirada na loja:* ${order.storeLocation.name}%0A${order.storeLocation.addressLine}, ${order.storeLocation.number}${order.storeLocation.complement ? `, ${order.storeLocation.complement}` : ""}%0A${order.storeLocation.neighborhood}, ${order.storeLocation.city} - ${order.storeLocation.state}, CEP ${order.storeLocation.postalCode}%0A%0A`
          : `*Recebimento:* Retirada no endereço da loja. O endereço será combinado pelo WhatsApp.%0A%0A`
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
