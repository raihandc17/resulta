"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { DASHBOARD_SECTIONS } from "@/lib/dashboardNav";
import styles from "./Dashboard.module.css";

const STORAGE_KEY = "dashboard-sidebar-order";

function restoreOrder() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DASHBOARD_SECTIONS;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return DASHBOARD_SECTIONS;

    const known = new Map(DASHBOARD_SECTIONS.map((item) => [item.id, item]));
    const restored = parsed
      .filter((entry) => entry?.id && known.has(entry.id))
      .map((entry) => known.get(entry.id));

    const missing = DASHBOARD_SECTIONS.filter(
      (item) => !restored.some((r) => r.id === item.id),
    );

    return restored.length ? [...restored, ...missing] : DASHBOARD_SECTIONS;
  } catch {
    return DASHBOARD_SECTIONS;
  }
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [items, setItems] = useState(DASHBOARD_SECTIONS);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  useEffect(() => {
    setItems(restoreOrder());
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items.map(({ id, label }) => ({ id, label }))),
    );
  }, [items]);

  function reorder(fromIndex, toIndex) {
    if (fromIndex === null || toIndex === null || fromIndex === toIndex) {
      return;
    }

    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  return (
    <aside className={styles.sidebar} aria-label="Dashboard navigation">
      <p className={styles.sidebarTitle}>Menu</p>
      <ul className={styles.sidebarList}>
        {items.map((item, index) => {
          const href = `/dashboard/${item.id}`;
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);
          const isDragging = dragIndex === index;
          const isOver = overIndex === index && dragIndex !== index;

          return (
            <li
              key={item.id}
              className={`${styles.sidebarRow} ${isDragging ? styles.sidebarRowDragging : ""} ${isOver ? styles.sidebarRowOver : ""}`}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => {
                event.preventDefault();
                setOverIndex(index);
              }}
              onDrop={() => {
                reorder(dragIndex, index);
                setDragIndex(null);
                setOverIndex(null);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
            >
              <Link
                href={href}
                draggable={false}
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
