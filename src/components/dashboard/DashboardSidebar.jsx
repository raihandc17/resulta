"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { saveSidebarOrder } from "@/actions/user";
import styles from "./Dashboard.module.css";

export default function DashboardSidebar({ initialItems }) {
  const pathname = usePathname();
  const [items, setItems] = useState(initialItems);
  const itemsRef = useRef(items);
  const dragFromRef = useRef(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  itemsRef.current = items;

  const serverOrderKey = initialItems.map((entry) => entry.id).join("|");

  useEffect(() => {
    setItems(initialItems);
    // Sync when the server sends a new order, not on every layout re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initialItems tracks serverOrderKey
  }, [serverOrderKey]);

  useEffect(() => {
    if (!saveSuccess) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [saveSuccess]);

  async function persistOrder(nextItems) {
    setSaveError("");
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      const result = await saveSidebarOrder(nextItems.map((entry) => entry.id));

      if (result?.error) {
        setSaveError(result.error);
        return false;
      }

      setSaveSuccess(true);
      return true;
    } finally {
      setIsSaving(false);
    }
  }

  function reorder(fromIndex, toIndex) {
    if (
      fromIndex === null ||
      toIndex === null ||
      Number.isNaN(fromIndex) ||
      Number.isNaN(toIndex) ||
      fromIndex === toIndex
    ) {
      return null;
    }

    const current = itemsRef.current;
    const next = [...current];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
  }

  function clearDragVisualState() {
    setDragIndex(null);
    setOverIndex(null);
  }

  function handleDrop(toIndex, event) {
    event.preventDefault();
    event.stopPropagation();

    const fromData = event.dataTransfer.getData("text/plain");
    const parsedFrom = Number.parseInt(fromData, 10);
    const fromIndex = Number.isNaN(parsedFrom)
      ? dragFromRef.current
      : parsedFrom;

    dragFromRef.current = null;
    clearDragVisualState();

    const next = reorder(fromIndex, toIndex);
    if (!next) {
      return;
    }

    const previous = itemsRef.current;
    setItems(next);

    void (async () => {
      const saved = await persistOrder(next);
      if (!saved) {
        setItems(previous);
      }
    })();
  }

  function handleDragOver(event, index) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setOverIndex(index);
  }

  return (
    <aside className={styles.sidebar} aria-label="Dashboard navigation">
      <p className={styles.sidebarTitle}>Menu</p>
      {isSaving ? (
        <p className={styles.sidebarHint} aria-live="polite">
          Saving menu…
        </p>
      ) : null}
      {saveSuccess && !saveError ? (
        <p className={styles.sidebarSuccess} aria-live="polite">
          Menu saved
        </p>
      ) : null}
      {saveError ? (
        <p className={styles.sidebarError} role="alert">
          {saveError}
        </p>
      ) : null}
      <ul className={styles.sidebarList}>
        {items.map((item, index) => {
          const href = `/dashboard/${item.id}`;
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          const isDragging = dragIndex === index;
          const isOver = overIndex === index && dragIndex !== index;

          return (
            <li
              key={item.id}
              className={`${styles.sidebarRow} ${isDragging ? styles.sidebarRowDragging : ""} ${isOver ? styles.sidebarRowOver : ""}`}
              draggable
              onDragStart={(event) => {
                dragFromRef.current = index;
                setDragIndex(index);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", String(index));
              }}
              onDragOver={(event) => handleDragOver(event, index)}
              onDrop={(event) => handleDrop(index, event)}
              onDragEnd={clearDragVisualState}
            >
              <Link
                href={href}
                draggable={false}
                onDragOver={(event) => handleDragOver(event, index)}
                onDrop={(event) => handleDrop(index, event)}
                className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ""}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
