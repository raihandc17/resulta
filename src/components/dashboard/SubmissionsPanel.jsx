"use client";

import { useEffect, useMemo, useState } from "react";

import { updateSubmissionStatus } from "@/actions/submissions";
import {
  getSubmissionStatusLabel,
  SUBMISSION_STATUSES,
} from "@/lib/submissionStatus";
import styles from "./Dashboard.module.css";

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function sameCalendarDay(iso, yyyyMmDd) {
  if (!yyyyMmDd) return true;
  const date = new Date(iso);
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return (
    date.getFullYear() === y &&
    date.getMonth() + 1 === m &&
    date.getDate() === d
  );
}

export default function SubmissionsPanel({ username, userRole, initialRows }) {
  const isAdmin = userRole === "admin";
  const roleLabel = isAdmin ? "Admin" : "General";
  //const email = userEmail?.trim().toLowerCase() || "";
  //const username = email.includes("@") ? email.split("@")[0] : email || "—";

  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateSort, setDateSort] = useState("newest");
  const [rows, setRows] = useState(initialRows);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const filteredRows = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = rows.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) {
        return false;
      }

      if (!sameCalendarDay(row.createdAt, dateFilter)) {
        return false;
      }

      if (!needle) {
        return true;
      }

      return (
        row.name.toLowerCase().includes(needle) ||
        row.email.toLowerCase().includes(needle) ||
        row.message.toLowerCase().includes(needle)
      );
    });

    return filtered.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return dateSort === "oldest" ? aTime - bTime : bTime - aTime;
    });
  }, [rows, query, dateFilter, statusFilter, dateSort]);

  const hasActiveFilters =
    query.trim() !== "" ||
    dateFilter !== "" ||
    statusFilter !== "all" ||
    dateSort !== "newest";

  function clearFilters() {
    setQuery("");
    setDateFilter("");
    setStatusFilter("all");
    setDateSort("newest");
  }

  async function handleStatusChange(id, nextStatus) {
    setStatusError("");
    const previous = rows;
    setRows((current) =>
      current.map((row) =>
        row.id === id ? { ...row, status: nextStatus } : row,
      ),
    );

    const result = await updateSubmissionStatus(id, nextStatus);

    if (result?.error) {
      setRows(previous);
      setStatusError(result.error);
    }
  }

  return (
    <div className={styles.submissionsPanel}>
      <header className={styles.submissionsHeader}>
        <div className={styles.submissionsIdentity}>
          <p className={styles.submissionsProfileLine}>
            Username :{" "}
            <span className={styles.submissionsProfileValue}>{username}</span>
          </p>
          <p className={styles.submissionsProfileLine}>
            Account type :{" "}
            <span
              className={
                isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeGeneral
              }
            >
              {roleLabel}
            </span>
          </p>
        </div>
        <p className={styles.submissionsHint}>
          {isAdmin
            ? "You can view and update all client messages."
            : "You can only see messages sent using your email."}
        </p>
      </header>

      <div className={styles.submissionsToolbar}>
        <div className={styles.submissionsToolbarRow}>
          <label className={styles.filterField}>
            <span className={styles.filterLabel}>Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, email, or message"
              className={styles.filterInput}
            />
          </label>
          <label className={styles.filterField}>
            <span className={styles.filterLabel}>Date</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className={styles.filterInput}
            />
          </label>
          <label className={styles.filterField}>
            <span className={styles.filterLabel}>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All statuses</option>
              {SUBMISSION_STATUSES.map((entry) => (
                <option key={entry.value} value={entry.value}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.submissionsToolbarRow}>
          <label className={styles.filterFieldSort}>
            <span className={styles.filterLabel}>Sort by date</span>
            <select
              value={dateSort}
              onChange={(event) => setDateSort(event.target.value)}
              className={styles.filterSelect}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
          <button
            type="button"
            className={styles.filterClearBtn}
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            Clear
          </button>
        </div>
      </div>

      {statusError ? (
        <p className={styles.submissionsError} role="alert">
          {statusError}
        </p>
      ) : null}

      <hr className={styles.submissionsDivider} aria-hidden />

      <div className={styles.tableWrap}>
        <table className={styles.submissionsTable}>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Message</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.tableEmpty}>
                  No messages match your filters.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.id}>
                  <td>{formatDate(row.createdAt)}</td>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td className={styles.messageCell}>{row.message}</td>
                  <td>
                    {isAdmin ? (
                      <select
                        value={row.status}
                        onChange={(event) =>
                          void handleStatusChange(row.id, event.target.value)
                        }
                        className={`${styles.statusSelect} ${styles[`status_${row.status}`]}`}
                        aria-label={`Status for ${row.name}`}
                      >
                        {SUBMISSION_STATUSES.map((entry) => (
                          <option key={entry.value} value={entry.value}>
                            {entry.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`${styles.statusBadge} ${styles[`status_${row.status}`]}`}
                      >
                        {getSubmissionStatusLabel(row.status)}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
