"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  cartLineKey,
  mergeCartLine,
  readCartFromStorage,
  writeCartToStorage,
} from "@/lib/shop/cartStorage";

const ShoppingCartContext = createContext(null);

export function ShoppingCartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    if (!cartReady) {
      return;
    }
    writeCartToStorage(cart);
  }, [cart, cartReady]);

  // Hydrate cart once on mount (avoid persisting [] before read completes).
  useEffect(() => {
    setCart(readCartFromStorage());
    setCartReady(true);
  }, []);

  const addToCart = useCallback((line) => {
    setCart((prev) => mergeCartLine(prev, line));
  }, []);

  const removeCartLine = useCallback((key) => {
    setCart((prev) =>
      prev.filter((line) => cartLineKey(line.productId, line.size) !== key),
    );
  }, []);

  const updateCartQuantity = useCallback((key, quantity) => {
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      return;
    }
    setCart((prev) =>
      prev.map((line) =>
        cartLineKey(line.productId, line.size) === key
          ? { ...line, quantity: qty }
          : line,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    writeCartToStorage([]);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart],
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [cart],
  );

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      cartSubtotal,
      cartReady,
      addToCart,
      removeCartLine,
      updateCartQuantity,
      clearCart,
    }),
    [
      cart,
      cartCount,
      cartSubtotal,
      cartReady,
      addToCart,
      removeCartLine,
      updateCartQuantity,
      clearCart,
    ],
  );

  return (
    <ShoppingCartContext.Provider value={value}>
      {children}
    </ShoppingCartContext.Provider>
  );
}

export function useShoppingCart() {
  const ctx = useContext(ShoppingCartContext);
  if (!ctx) {
    throw new Error("useShoppingCart must be used within ShoppingCartProvider");
  }
  return ctx;
}
