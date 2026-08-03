import { redirect } from "next/navigation";

import { DEFAULT_DASHBOARD_SECTION } from "@/lib/dashboardNav";

export default function DashboardIndexPage() {
  redirect(`/dashboard/${DEFAULT_DASHBOARD_SECTION}`);
}
