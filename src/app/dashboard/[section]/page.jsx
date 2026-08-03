import { notFound } from "next/navigation";

import styles from "@/components/dashboard/Dashboard.module.css";
import {
  DASHBOARD_SECTIONS,
  getDashboardSection,
  isDashboardSection,
} from "@/lib/dashboardNav";

export function generateStaticParams() {
  return DASHBOARD_SECTIONS.map((item) => ({ section: item.id }));
}

export default async function DashboardSectionPage({ params }) {
  const { section } = await params;

  if (!isDashboardSection(section)) {
    notFound();
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
