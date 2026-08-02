import { redirect } from "next/navigation";

import Dashboard from "@/components/dashboard/Dashboard";
import { getSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/?login=true");
  }

  const userName =
    typeof session.name === "string" ? session.name : "User";
  const userEmail =
    typeof session.email === "string" ? session.email : undefined;

  return <Dashboard userName={userName} userEmail={userEmail} />;
}
