import Link from "next/link";

import { logoutUser } from "@/actions/auth";
import styles from "./Dashboard.module.css";

/**
 * Authenticated app shell. Add charts, tables, and admin UI in this component later.
 */
export default function Dashboard({ userName, userEmail }) {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <span className={styles.brand}>TechSolveX Admin</span>
        <div className={styles.headerActions}>
          <span>{userName}</span>
          <Link href="/">Public site</Link>
          <form action={logoutUser}>
            <button type="submit" className={styles.logoutBtn}>
              Log out
            </button>
          </form>
        </div>
      </header>

      <main className={styles.main}>
        <h1>Dashboard</h1>
        <p className={styles.subtitle}>
          Signed in as {userEmail ?? userName}
        </p>

        <div className={styles.placeholder}>
          <p>
            Build your dashboard here — widgets, user management, analytics, and
            more.
          </p>
        </div>
      </main>
    </div>
  );
}
