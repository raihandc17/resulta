import { ShoppingCartProvider } from "@/components/dashboard/ShoppingCartProvider";

export default function ShoppingLayout({ children }) {
  return <ShoppingCartProvider>{children}</ShoppingCartProvider>;
}
