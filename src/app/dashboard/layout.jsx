import { redirect } from "next/navigation";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { getSession } from "@/lib/session";

export default async function DashboardLayout({ children }) {
  const session = await getSession();

  if (!session) {
    redirect("/?login=true");
  }

  const userName =
    typeof session.name === "string" ? session.name : "User";
  const userEmail =
    typeof session.email === "string" ? session.email : undefined;

  return (
    <DashboardShell userName={userName} userEmail={userEmail}>
      {children}
    </DashboardShell>
  );
}
