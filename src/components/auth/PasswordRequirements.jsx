"use client";

import { getPasswordRules } from "@/lib/password";
import styles from "./PasswordRequirements.module.css";

export default function PasswordRequirements({ password = "" }) {
  const rules = getPasswordRules();

  return (
    <ul className={styles.list} aria-label="Password requirements">
      {rules.map((rule) => {
        const met = rule.test(password);
        return (
          <li
            key={rule.id}
            className={met ? styles.met : styles.unmet}
          >
            {met ? "✓" : "○"} {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
