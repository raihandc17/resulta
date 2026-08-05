import { notFound } from "next/navigation";

import ShoppingPanel from "@/components/dashboard/ShoppingPanel";
import { getCurrentUser } from "@/lib/authServer";
import { isShoppingTab, SHOPPING_TABS } from "@/lib/shoppingNav";

export function generateStaticParams() {
  return SHOPPING_TABS.map((tab) => ({ tab: tab.id }));
}

export default async function ShoppingTabPage({ params }) {
  const { tab } = await params;

  if (!isShoppingTab(tab)) {
    notFound();
  }

  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  return <ShoppingPanel userRole={user.role ?? "general"} activeTab={tab} />;
}
