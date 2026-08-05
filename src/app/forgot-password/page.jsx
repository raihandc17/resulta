"use client";

import Link from "next/link";
import { useActionState } from "react";

import { requestPasswordReset } from "@/actions/passwordReset";
import styles from "@/app/register/register.module.css";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    null,
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Forgot password</h1>
        {state?.success ? (
          <p className={styles.successMessage} role="status">
            If an account matches that email, we&apos;ll sent instructions to
            reset your password. The link expires in one hour. Check your inbox,
            including spam or junk folders.
          </p>
        ) : (
          <p className={styles.subtitle}>
            Enter the email address for your account. We&apos;ll send you a
            secure link to choose a new password.
          </p>
        )}

        {state?.error ? (
          <p className={styles.error} role="alert">
            {state.error}
          </p>
        ) : null}

        {state?.success && state.devResetUrl ? (
          <div className={styles.devHint}>
            <strong>Development:</strong> email is not configured. Use this
            reset link instead: <a href={state.devResetUrl}>Open reset page</a>
          </div>
        ) : null}

        {!state?.success ? (
          <form className={styles.form} action={formAction}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <button
              className={styles.registerBtn}
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Sending…" : "Send reset link"}
            </button>
          </form>
        ) : null}

        <p className={styles.login}>
          <Link href="/?login=true">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
