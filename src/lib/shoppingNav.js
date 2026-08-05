export const SHOPPING_TABS = [
  { id: "products", label: "Products" },
  { id: "cart", label: "Cart" },
  { id: "orders", label: "My order history" },
  { id: "favorites", label: "My favorite products" },
];

export const DEFAULT_SHOPPING_TAB = SHOPPING_TABS[0].id;

export function isShoppingTab(id) {
  return SHOPPING_TABS.some((tab) => tab.id === id);
}

export function shoppingTabHref(tabId) {
  return `/dashboard/shopping/${tabId}`;
}
