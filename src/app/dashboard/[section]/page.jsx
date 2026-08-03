import { notFound } from "next/navigation";

import SubmissionsPanel from "@/components/dashboard/SubmissionsPanel";
import styles from "@/components/dashboard/Dashboard.module.css";
import { getCurrentUser } from "@/lib/authServer";
import {
  DASHBOARD_SECTIONS,
  getDashboardSection,
  isDashboardSection,
} from "@/lib/dashboardNav";
import { listSubmissionsForDashboard } from "@/lib/listSubmissions";

const SUBMISSIONS_SECTION = "projects";

export function generateStaticParams() {
  return DASHBOARD_SECTIONS.map((item) => ({ section: item.id }));
}

export default async function DashboardSectionPage({ params }) {
  const { section } = await params;

  if (!isDashboardSection(section)) {
    notFound();
  }

  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  if (section === SUBMISSIONS_SECTION) {
    const submissions = await listSubmissionsForDashboard(user);

    return (
      <SubmissionsPanel
        username={user.name}
        userRole={user.role ?? "general"}
        initialRows={submissions}
      />
    );
  }

  const item = getDashboardSection(section);

  return (
    <>
      <h1>{item.label}</h1>
      <div className={styles.placeholder}>
        <p>
          Content for <strong>{item.label}</strong> goes here.
        </p>
      </div>
    </>
  );
}
