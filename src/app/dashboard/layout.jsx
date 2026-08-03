import { redirect } from "next/navigation";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/authServer";
import { resolveSidebarItems } from "@/lib/dashboardNav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/?login=true");
  }

  const sidebarItems = resolveSidebarItems(user.sidebarOrder);

  return (
    <DashboardShell
      userName={user.name}
      userEmail={user.email}
      userRole={user.role ?? "general"}
      sidebarItems={sidebarItems}
    >
      {children}
    </DashboardShell>
  );
}
