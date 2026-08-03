"use client";

import { useEffect } from "react";

import styles from "./Toast.module.css";

const AUTO_DISMISS_MS = 5000;

export default function Toast({
  message,
  variant = "success",
  onClose,
  placement = "fixed",
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onClose();
    }, AUTO_DISMISS_MS);

    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  const viewportClass =
    placement === "form"
      ? styles.viewportForm
      : placement === "contact"
        ? styles.viewportContact
        : styles.viewportFixed;

  return (
    <div
      className={`${viewportClass} ${variant === "error" ? styles.error : styles.success}`}
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <div className={styles.toast}>
        <p className={styles.message}>{message}</p>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
