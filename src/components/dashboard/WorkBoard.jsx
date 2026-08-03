"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateWorkItemStatus } from "@/actions/work";
import { isAdminRole } from "@/lib/roles";
import { WORK_STATUSES, getWorkStatusLabel } from "@/lib/workBoard";
import styles from "./WorkBoard.module.css";

export default function WorkBoard({ sectionLabel, items, userRole }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const isAdmin = isAdminRole(userRole);

  function handleStatusChange(workItemId, nextStatus) {
    setError("");

    startTransition(async () => {
      const result = await updateWorkItemStatus(workItemId, nextStatus);

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <section className={styles.board} aria-labelledby="work-board-title">
      <div className={styles.boardHeader}>
        <h2 id="work-board-title">Work progress</h2>
        <p>
          {isAdmin
            ? "You can update status for each item below."
            : "View only — contact an admin to change status."}
        </p>
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={String(item._id)} className={styles.row}>
            <div className={styles.rowMain}>
              <span className={styles.itemTitle}>{item.title}</span>
              <span className={styles.sectionTag}>{sectionLabel}</span>
            </div>

            {isAdmin ? (
              <select
                className={styles.statusSelect}
                value={item.status}
                disabled={isPending}
                aria-label={`Status for ${item.title}`}
                onChange={(event) =>
                  handleStatusChange(String(item._id), event.target.value)
                }
              >
                {WORK_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className={`${styles.statusBadge} ${styles[item.status]}`}>
                {getWorkStatusLabel(item.status)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
