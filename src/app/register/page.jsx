"use client";

import { useRouter } from "next/navigation";
import Button from "../../components/Button/Button";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Create Account</h1>
        <p>Join TechSolveX today.</p>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" placeholder="Create a password" />
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm password" />
          </div>

          <button className={styles.registerBtn}>Register</button>
        </form>

        <div className={styles.login} variant="btnColor2">
          Already have an account?
          <Button
            variant="btnColor2"
            onClick={() => {
              router.push("/");
            }}
          >
            Go to Login page
          </Button>
        </div>
      </div>
    </div>
  );
}
