import styles from "./Button.module.css";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
