//import Link from "next/link";

import styles from "./not-found.module.css";

export const metadata = {
  title: "Page not found | TechSolveX",
  description: "The page you requested could not be found.",
};

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.subtitle}>
          The link may be broken, or the page may have been moved. Return to the
          homepage or sign in to continue to your dashboard.
        </p>
        {/* <div className={styles.actions}>
          <Link href="/" className={styles.primary}>
            Back to homepage
          </Link>
          <Link href="/?login=true" className={styles.secondary}>
            Sign in
          </Link>
        </div> */}
        <p className={styles.brand}>TechSolveX</p>
      </div>
    </div>
  );
}
