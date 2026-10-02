import { supabase, isSupabaseConfigured } from "./supabase";
import type { Order, OrderStatus } from "../shared/interfaces/Order";

const LOCAL_STORAGE_ORDERS_KEY = "@jotad3d:orders";

interface SupabaseOrderItemRow {
  produto_id: string | number | null;
  produtos?: { nome: string | null; imagem_url: string | null } | null;
  quantidade: number;
  preco_unitario: number | string;
  cor_escolhida: string | null;
}

interface SupabaseOrderRow {
  id: string | number;
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

const generateAccessCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "JD-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const getLocalOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalOrder = (order: Order) => {
  try {
    const current = getLocalOrders();
    localStorage.setItem(
      LOCAL_STORAGE_ORDERS_KEY,
      JSON.stringify([order, ...current]),
    );
  } catch {
    return;
  }
};

export const ordersService = {
  async getAll(): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("pedidos")
          .select("*, pedido_itens(*, produtos(*))")
          .order("data_criacao", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((d: SupabaseOrderRow) => {
            let status: OrderStatus = "recebido";
            if (d.concluido) status = "finalizado";
            else if (d.pronto_para_entrega) status = "pronto";
            else status = "producao";

            return {
              id: String(d.id),
              accessCode: `JD-${String(d.id).slice(0, 5).toUpperCase()}`,
              orderNumber: Math.floor(1000 + Math.random() * 9000),
              customerName: d.cliente_nome,
              whatsapp: d.whatsapp || "",
              email: d.email || "",
              address: {
                cep: d.cep || "",
                rua: d.endereco || "",
                numero: d.numero || "",
                bairro: d.bairro || "",
                cidade: d.cidade || "",
                complemento: d.complemento || "",
              },
              items: (d.pedido_itens || []).map((it: SupabaseOrderItemRow) => ({
                productId: String(it.produto_id),
                productName: it.produtos?.nome || "Peça 3D",
                imageUrl: it.produtos?.imagem_url || "",
                quantity: it.quantidade,
                unitPrice: Number(it.preco_unitario),
                color: it.cor_escolhida || "Preto",
              })),
              totalAmount: Number(d.valor_total),
              status,
              paid: Boolean(d.pago),
              notes: d.observacoes || "",
              createdAt: d.data_criacao || new Date().toISOString(),
            };
          });
        }
      } catch (error) {
        console.error("Falha ao carregar pedidos do Supabase.", error);
      }
    }

    return getLocalOrders();
  },

  async create(
    orderInput: Omit<
      Order,
      "id" | "accessCode" | "orderNumber" | "createdAt" | "status" | "paid"
    >,
  ): Promise<Order> {
    const accessCode = generateAccessCode();
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const createdAt = new Date().toISOString();

    const newOrder: Order = {
      ...orderInput,
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      accessCode,
      orderNumber,
      createdAt,
      status: "recebido",
      paid: false,
    };

    saveLocalOrder(newOrder);

    if (isSupabaseConfigured && supabase) {
      try {
        const fullAddress = `${orderInput.address.rua}, ${orderInput.address.numero} - ${orderInput.address.bairro}, ${orderInput.address.cidade} - CEP: ${orderInput.address.cep}${orderInput.address.complemento ? ` (${orderInput.address.complemento})` : ""}`;

        const { data: insertedOrder, error: orderError } = await supabase
          .from("pedidos")
          .insert({
            cliente_nome: orderInput.customerName,
            cidade: orderInput.address.cidade,
            valor_total: orderInput.totalAmount,
            pago: false,
            pronto_para_entrega: false,
            concluido: false,
            observacoes: `WhatsApp: ${orderInput.whatsapp} | Endereço: ${fullAddress} | Código: ${accessCode}`,
          })
          .select("id")
          .single();

        if (!orderError && insertedOrder) {
          newOrder.id = String(insertedOrder.id);

          const itemsToInsert = orderInput.items.map((item) => ({
            pedido_id: insertedOrder.id,
            produto_id: item.productId.startsWith("3d-")
              ? null
              : item.productId,
            quantidade: item.quantity,
            preco_unitario: item.unitPrice,
            cor_escolhida: item.color || "Padrão",
          }));

          await supabase.from("pedido_itens").insert(itemsToInsert);
        }
      } catch (error) {
        console.error("Falha ao salvar pedido no Supabase.", error);
      }
    }

    return newOrder;
  },

  async updateStatus(
    id: string,
    status: OrderStatus,
    paid?: boolean,
    notes?: string,
  ): Promise<boolean> {
    const local = getLocalOrders();
    const updated = local.map((o) => {
      if (o.id === id || o.accessCode === id) {
        return {
          ...o,
          status,
          paid: paid !== undefined ? paid : o.paid,
          notes: notes !== undefined ? notes : o.notes,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured && supabase) {
      try {
        const patch: Record<string, unknown> = {};
        if (paid !== undefined) patch.pago = paid;
        if (notes !== undefined) patch.observacoes = notes;
        if (status === "pronto" || status === "finalizado")
          patch.pronto_para_entrega = true;
        if (status === "finalizado") patch.concluido = true;

        await supabase.from("pedidos").update(patch).eq("id", id);
      } catch (error) {
        console.error("Falha ao atualizar pedido no Supabase.", error);
      }
    }

    return true;
  },

  async getByCodeOrNumber(query: string): Promise<Order | null> {
    const cleanQuery = query.trim().toUpperCase();
    const localOrders = getLocalOrders();
    const foundLocal = localOrders.find(
      (o) =>
        o.accessCode.toUpperCase() === cleanQuery ||
        String(o.orderNumber) === cleanQuery ||
        o.id === cleanQuery,
    );

    if (foundLocal) {
      return foundLocal;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("pedidos")
          .select("*, pedido_itens(*)")
          .or(`id.eq.${cleanQuery},cliente_nome.ilike.%${cleanQuery}%`)
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          let status: OrderStatus = "recebido";
          if (data.concluido) status = "finalizado";
          else if (data.pronto_para_entrega) status = "pronto";
          else status = "producao";

          return {
            id: String(data.id),
            accessCode: cleanQuery,
            orderNumber: 1000,
            customerName: data.cliente_nome,
            whatsapp: "",
            address: {
              cep: "",
              rua: "",
              numero: "",
              bairro: "",
              cidade: data.cidade,
            },
            items: (data.pedido_itens || []).map(
              (it: SupabaseOrderItemRow) => ({
                productId: String(it.produto_id),
                productName: "Peça Impressa 3D",
                imageUrl: "",
                quantity: it.quantidade,
                unitPrice: Number(it.preco_unitario),
                color: it.cor_escolhida,
              }),
            ),
            totalAmount: Number(data.valor_total),
            status,
            paid: Boolean(data.pago),
            createdAt: data.data_criacao || new Date().toISOString(),
          };
        }
      } catch (error) {
        console.error("Falha ao buscar pedido no Supabase.", error);
      }
    }

    return null;
  },

  buildWhatsAppMessage(order: Order, companyNumber: string): string {
    const cleanPhone = companyNumber.replace(/\D/g, "");
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
      `*Endereço de Entrega:*%0A${order.address.rua}, ${order.address.numero}${order.address.complemento ? ` (${order.address.complemento})` : ""} - ${order.address.bairro}%0A${order.address.cidade} - CEP: ${order.address.cep}%0A%0A` +
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
