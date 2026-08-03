export const DASHBOARD_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "projects", label: "Projects" },
  { id: "analytics", label: "Analytics" },
  { id: "clients", label: "Clients" },
  { id: "reports", label: "Reports" },
  { id: "settings", label: "Settings" },
];

export const DEFAULT_DASHBOARD_SECTION = DASHBOARD_SECTIONS[0].id;

export function getDashboardSection(id) {
  return DASHBOARD_SECTIONS.find((item) => item.id === id);
}

export function isDashboardSection(id) {
  return DASHBOARD_SECTIONS.some((item) => item.id === id);
}

export function resolveSidebarItems(orderIds) {
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return DASHBOARD_SECTIONS;
  }

  const known = new Map(DASHBOARD_SECTIONS.map((item) => [item.id, item]));
  const ordered = orderIds
    .filter((id) => typeof id === "string" && known.has(id))
    .map((id) => known.get(id));

  const missing = DASHBOARD_SECTIONS.filter(
    (item) => !ordered.some((entry) => entry.id === item.id),
  );

  return ordered.length ? [...ordered, ...missing] : DASHBOARD_SECTIONS;
}
