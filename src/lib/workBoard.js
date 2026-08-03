export const WORK_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "complete", label: "Complete" },
  { value: "on_hold", label: "On hold" },
  { value: "cancelled", label: "Cancelled" },
];

export const WORK_BOARD_SECTIONS = ["projects", "clients", "reports"];

export function isWorkBoardSection(sectionId) {
  return WORK_BOARD_SECTIONS.includes(sectionId);
}

export function getWorkStatusLabel(value) {
  return WORK_STATUSES.find((status) => status.value === value)?.label ?? value;
}
