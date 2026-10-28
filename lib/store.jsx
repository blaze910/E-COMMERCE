"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PRODUCTS } from "./products";
const CART_KEY = "novaedge:cart";
const ORDERS_KEY = "novaedge:orders";
const CATALOG_KEY = "novaedge:catalog";
const StoreContext = createContext(null);
function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — keep the session working in memory */
  }
}
export const TAX_RATE = 0.08;
export function StoreProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);
  const [catalog, setCatalog] = useState(PRODUCTS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    setCatalog(read(CATALOG_KEY, PRODUCTS));
    setCart(read(CART_KEY, []));
    setOrders(read(ORDERS_KEY, []));
    setHydrated(true);
  }, []);
  const persistCart = useCallback((next) => {
    setCart(next);
    write(CART_KEY, next);
  }, []);
  const persistCatalog = useCallback((next) => {
    setCatalog(next);
    write(CATALOG_KEY, next);
  }, []);
  const getProduct = useCallback(
    (id) => catalog.find((product) => product.id === id),
    [catalog],
  );
  const addToCart = useCallback(
    (productId, quantity = 1) => {
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
    (productId, quantity) => {
      if (quantity <= 0) {
        persistCart(cart.filter((line) => line.productId !== productId));
        return;
      }
      persistCart(
        cart.map((line) =>
          line.productId === productId
            ? { ...line, quantity: Math.min(99, quantity) }
            : line,
        ),
      );
    },
    [cart, persistCart],
  );
  const removeFromCart = useCallback(
    (productId) =>
      persistCart(cart.filter((line) => line.productId !== productId)),
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
    ({ name, email, discount }) => {
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
        .filter(Boolean);
      if (lines.length === 0) return null;
      const orderSubtotal = lines.reduce(
        (sum, line) => sum + line.price * line.quantity,
        0,
      );
      const discountValue = Math.min(discount, orderSubtotal);
      const tax = (orderSubtotal - discountValue) * TAX_RATE;
      const order = {
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
    (product) => {
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
    (id) => {
      persistCatalog(catalog.filter((item) => item.id !== id));
      persistCart(cart.filter((line) => line.productId !== id));
    },
    [cart, catalog, persistCart, persistCatalog],
  );
  const resetCatalog = useCallback(
    () => persistCatalog(PRODUCTS),
    [persistCatalog],
  );
  const value = {
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
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
export const DISCOUNT_CODES = {
  NOVA10: 0.1,
  LAUNCH20: 0.2,
};
