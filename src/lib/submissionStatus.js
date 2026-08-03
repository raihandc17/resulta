export const SUBMISSION_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "complete", label: "Complete" },
];

export function getSubmissionStatusLabel(value) {
  return (
    SUBMISSION_STATUSES.find((entry) => entry.value === value)?.label ??
    "Pending"
  );
}

export function normalizeSubmissionStatus(value) {
  if (value === "in_progress" || value === "complete") {
    return value;
  }
  return "pending";
}
