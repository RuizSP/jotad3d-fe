import { createContext, useContext, useState, type ReactNode } from "react";

interface OrderTrackingContextValue {
  trackingCode: string;
  setTrackingCode: (code: string) => void;
}

const OrderTrackingContext = createContext<
  OrderTrackingContextValue | undefined
>(undefined);

export function OrderTrackingProvider({ children }: { children: ReactNode }) {
  const [trackingCode, setTrackingCode] = useState("");

  return (
    <OrderTrackingContext.Provider value={{ trackingCode, setTrackingCode }}>
      {children}
    </OrderTrackingContext.Provider>
  );
}

export function useOrderTracking() {
  const context = useContext(OrderTrackingContext);
  if (!context) {
    throw new Error(
      "useOrderTracking deve ser usado dentro de OrderTrackingProvider",
    );
  }
  return context;
}
