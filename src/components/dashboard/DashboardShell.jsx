"use client";

import { logoutUser } from "@/actions/auth";
import DashboardSidebar from "./DashboardSidebar";
import styles from "./Dashboard.module.css";

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardShell({
  userName,
  userEmail,
  userRole,
  sidebarItems,
  children,
}) {
  const displayName = userName?.trim() || "User";
  const initials = getInitials(displayName);
  const roleLabel = userRole === "admin" ? "Admin" : "General";

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.companyPill}>Company name</div>

        <div className={styles.headerRight}>
          <div className={styles.profilePill}>
            <span className={styles.avatar} aria-hidden>
              {initials}
            </span>
            <span className={styles.profileName}>{displayName}</span>
            <button
              type="button"
              className={styles.editBtn}
              aria-label="Edit profile"
            >
              <EditIcon />
            </button>
          </div>
          <form action={logoutUser} className={styles.logoutForm}>
            <button type="submit" className={styles.logoutNavBtn}>
              Log out
            </button>
          </form>
        </div>
      </header>

      <div className={styles.layout}>
        <DashboardSidebar
          key={userEmail ?? userName}
          initialItems={sidebarItems}
        />

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 20h4l10.5-10.5a1.5 1.5 0 0 0 0-2.12L16.62 5.5a1.5 1.5 0 0 0-2.12 0L4 16v4z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 6.5l4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
