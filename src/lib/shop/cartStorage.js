const STORAGE_KEY = "resulta-shop-cart";

export function cartLineKey(productId, size) {
  return `${productId}::${size}`;
}

export function readCartFromStorage() {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (line) =>
        line &&
        typeof line.productId === "string" &&
        typeof line.name === "string" &&
        typeof line.gender === "string" &&
        typeof line.size === "string" &&
        Number.isFinite(line.quantity) &&
        line.quantity >= 1 &&
        Number.isFinite(line.unitPrice) &&
        line.unitPrice >= 0,
    );
  } catch {
    return [];
  }
}

export function writeCartToStorage(lines) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* ignore quota errors */
  }
}

export function mergeCartLine(cart, line) {
  const key = cartLineKey(line.productId, line.size);
  const next = [...cart];
  const index = next.findIndex(
    (entry) => cartLineKey(entry.productId, entry.size) === key,
  );
  if (index >= 0) {
    next[index] = {
      ...next[index],
      ...line,
      quantity: next[index].quantity + line.quantity,
    };
  } else {
    next.push(line);
  }
  return next;
}
