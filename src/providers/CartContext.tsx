import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  color?: string;
}

interface CartContextData {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (compositeId: string) => void;
  updateQuantity: (compositeId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartDrawerOpen: boolean;
  toggleCartDrawer: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);
const CART_STORAGE_KEY = `@catalogo3d:${import.meta.env.VITE_SUPABASE_URL || "local"}:cart`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      return;
    }
  }, [items]);

  const getItemKey = (item: { id: string; color?: string }) =>
    `${item.id}__${item.color || "padrao"}`;

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const key = getItemKey(item);
      const existing = prev.find((i) => getItemKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          getItemKey(i) === key
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i,
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeItem = (compositeId: string) => {
    setItems((prev) =>
      prev.filter((i) => getItemKey(i) !== compositeId && i.id !== compositeId),
    );
  };

  const updateQuantity = (compositeId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(compositeId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        getItemKey(i) === compositeId || i.id === compositeId
          ? { ...i, quantity }
          : i,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleCartDrawer = () => setIsCartDrawerOpen((prev) => !prev);
  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartDrawerOpen,
        toggleCartDrawer,
        openCartDrawer,
        closeCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
