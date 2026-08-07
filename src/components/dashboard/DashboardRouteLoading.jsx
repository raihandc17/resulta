"use client";

import { usePathname } from "next/navigation";

import {
  DashboardSectionSkeleton,
  ProjectsTableSkeleton,
  ShopDataSkeleton,
} from "@/components/dashboard/LoadingSkeleton";

function shoppingTabFromPath(pathname) {
  const segment = pathname.split("/").filter(Boolean).pop();
  if (
    segment === "products" ||
    segment === "cart" ||
    segment === "orders" ||
    segment === "favorites"
  ) {
    return segment;
  }
  return "products";
}

export function DashboardRouteLoading() {
  const pathname = usePathname() ?? "";

  if (pathname.includes("/dashboard/shopping")) {
    return <ShopDataSkeleton tab={shoppingTabFromPath(pathname)} />;
  }

  if (pathname.includes("/dashboard/projects")) {
    return <ProjectsTableSkeleton />;
  }

  return <DashboardSectionSkeleton />;
}

export function ShoppingTabLoading() {
  const pathname = usePathname() ?? "";
  return <ShopDataSkeleton tab={shoppingTabFromPath(pathname)} />;
}
