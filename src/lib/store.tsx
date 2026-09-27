import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { PRODUCTS, type Product } from "./products";

const CART_KEY = "novaedge:cart";
const ORDERS_KEY = "novaedge:orders";
const CATALOG_KEY = "novaedge:catalog";

export type CartLine = { productId: string; quantity: number };

export type Order = {
  id: string;
  placedAt: string;
  status: "processing" | "delivered";
  email: string;
  name: string;
  lines: { productId: string; name: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
};

type StoreValue = {
  hydrated: boolean;
  catalog: Product[];
  cart: CartLine[];
  orders: Order[];
  itemCount: number;
  subtotal: number;
  getProduct: (id: string) => Product | undefined;
  addToCart: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (details: { name: string; email: string; discount: number }) => Order | null;
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetCatalog: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — keep the session working in memory */
  }
}

export const TAX_RATE = 0.08;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [catalog, setCatalog] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setCatalog(read<Product[]>(CATALOG_KEY, PRODUCTS));
    setCart(read<CartLine[]>(CART_KEY, []));
    setOrders(read<Order[]>(ORDERS_KEY, []));
    setHydrated(true);
  }, []);

  const persistCart = useCallback((next: CartLine[]) => {
    setCart(next);
    write(CART_KEY, next);
  }, []);

  const persistCatalog = useCallback((next: Product[]) => {
    setCatalog(next);
    write(CATALOG_KEY, next);
  }, []);

  const getProduct = useCallback(
    (id: string) => catalog.find((product) => product.id === id),
    [catalog],
  );

  const addToCart = useCallback(
    (productId: string, quantity = 1) => {
      const existing = cart.find((line) => line.productId === productId);
      const next = existing
        ? cart.map((line) =>
            line.productId === productId
              ? { ...line, quantity: Math.min(99, line.quantity + quantity) }
              : line,
          )
        : [...cart, { productId, quantity }];
      persistCart(next);
    },
    [cart, persistCart],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        persistCart(cart.filter((line) => line.productId !== productId));
        return;
      }
      persistCart(
        cart.map((line) =>
          line.productId === productId ? { ...line, quantity: Math.min(99, quantity) } : line,
        ),
      );
    },
    [cart, persistCart],
  );

  const removeFromCart = useCallback(
    (productId: string) => persistCart(cart.filter((line) => line.productId !== productId)),
    [cart, persistCart],
  );

  const clearCart = useCallback(() => persistCart([]), [persistCart]);

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, line) => {
        const product = catalog.find((item) => item.id === line.productId);
        return product ? sum + product.price * line.quantity : sum;
      }, 0),
    [cart, catalog],
  );

  const itemCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart],
  );

  const placeOrder = useCallback(
    ({ name, email, discount }: { name: string; email: string; discount: number }) => {
      const lines = cart
        .map((line) => {
          const product = catalog.find((item) => item.id === line.productId);
          if (!product) return null;
          return {
            productId: product.id,
            name: product.name,
            quantity: line.quantity,
            price: product.price,
          };
        })
        .filter(Boolean) as Order["lines"];

      if (lines.length === 0) return null;

      const orderSubtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
      const discountValue = Math.min(discount, orderSubtotal);
      const tax = (orderSubtotal - discountValue) * TAX_RATE;
      const order: Order = {
        id: `NE-${Date.now().toString(36).toUpperCase().slice(-6)}`,
        placedAt: new Date().toISOString(),
        status: "processing",
        name,
        email,
        lines,
        subtotal: orderSubtotal,
        discount: discountValue,
        tax,
        total: orderSubtotal - discountValue + tax,
      };

      const nextOrders = [order, ...orders];
      setOrders(nextOrders);
      write(ORDERS_KEY, nextOrders);
      persistCart([]);
      return order;
    },
    [cart, catalog, orders, persistCart],
  );

  const saveProduct = useCallback(
    (product: Product) => {
      const exists = catalog.some((item) => item.id === product.id);
      persistCatalog(
        exists
          ? catalog.map((item) => (item.id === product.id ? product : item))
          : [product, ...catalog],
      );
    },
    [catalog, persistCatalog],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      persistCatalog(catalog.filter((item) => item.id !== id));
      persistCart(cart.filter((line) => line.productId !== id));
    },
    [cart, catalog, persistCart, persistCatalog],
  );

  const resetCatalog = useCallback(() => persistCatalog(PRODUCTS), [persistCatalog]);

  const value: StoreValue = {
    hydrated,
    catalog,
    cart,
    orders,
    itemCount,
    subtotal,
    getProduct,
    addToCart,
    setQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    saveProduct,
    deleteProduct,
    resetCatalog,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}

export const DISCOUNT_CODES: Record<string, number> = {
  NOVA10: 0.1,
  LAUNCH20: 0.2,
};
