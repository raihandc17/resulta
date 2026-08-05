"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

import { registerUser } from "@/actions/auth";
import PasswordRequirements from "@/components/auth/PasswordRequirements";
import Button from "@/components/Button/Button";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [state, formAction, isPending] = useActionState(registerUser, null);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Create Account</h1>
        <p className={styles.subtitle}>Join TechSolveX today.</p>

        {state?.error ? (
          <p className={styles.error} role="alert">
            {state.error}
          </p>
        ) : null}

        <form className={styles.form} action={formAction}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordRequirements password={password} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              minLength={8}
              required
            />
          </div>

          <button
            className={styles.registerBtn}
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Registering…" : "Register"}
          </button>
        </form>

        <div className={styles.login}>
          Already have an account?
          <Button
            variant="btnColor2"
            onClick={() => {
              router.push("/?login=true");
            }}
          >
            Go to Login page
          </Button>
        </div>
      </div>
    </div>
  );
}
