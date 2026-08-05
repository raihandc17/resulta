"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState, useState } from "react";

import { completePasswordReset } from "@/actions/passwordReset";
import PasswordRequirements from "@/components/auth/PasswordRequirements";
import styles from "@/app/register/register.module.css";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [state, formAction, isPending] = useActionState(
    completePasswordReset,
    null,
  );

  if (!token) {
    return (
      <div className={styles.card}>
        <h1>Invalid link</h1>
        <p className={styles.error} role="alert">
          This password reset link is missing or invalid. Request a new one.
        </p>
        <p className={styles.login}>
          <Link href="/forgot-password">Request reset link</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h1>Set new password</h1>
      <p className={styles.subtitle}>Choose a strong password for your account.</p>

      {state?.error ? (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      ) : null}

      {state?.success ? (
        <>
          <p className={styles.success} role="status">
            {state.success}
          </p>
          <p className={styles.login}>
            <Link href="/?login=true">Sign in</Link>
          </p>
        </>
      ) : (
        <form className={styles.form} action={formAction}>
          <input type="hidden" name="token" value={token} />

          <div className={styles.inputGroup}>
            <label htmlFor="password">New password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="New password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordRequirements password={password} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            className={styles.registerBtn}
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving…" : "Update password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<div className={styles.card}>Loading…</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
