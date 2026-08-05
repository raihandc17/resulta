import { redirect } from "next/navigation";

import {
  DEFAULT_SHOPPING_TAB,
  shoppingTabHref,
} from "@/lib/shoppingNav";

export default function ShoppingIndexPage() {
  redirect(shoppingTabHref(DEFAULT_SHOPPING_TAB));
}
