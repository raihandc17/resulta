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
