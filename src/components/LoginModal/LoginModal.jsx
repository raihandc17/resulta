"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { loginUser } from "@/actions/auth";
import { DEFAULT_DASHBOARD_SECTION } from "@/lib/dashboardNav";
import styles from "./LoginModal.module.css";

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const result = await loginUser(formData);

    setIsPending(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    onClose();
    router.push(`/dashboard/${DEFAULT_DASHBOARD_SECTION}`);
    router.refresh();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose}>
          ✕
        </button>

        <h2>Login</h2>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
          />

          <p className={styles.forgotRow}>
            <Link
              href="/forgot-password"
              className={styles.forgotLink}
              onClick={onClose}
            >
              Forgot password?
            </Link>
          </p>

          <button type="submit" disabled={isPending}>
            {isPending ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
