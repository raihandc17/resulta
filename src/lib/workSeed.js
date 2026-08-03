import { connectDB } from "@/lib/db";
import WorkItem from "@/models/WorkItem";

const DEFAULT_ITEMS = {
  projects: [
    { title: "Company website redesign", status: "in_progress" },
    { title: "Mobile app MVP", status: "pending" },
    { title: "API integration", status: "pending" },
  ],
  clients: [
    { title: "Onboard Acme Corp", status: "complete" },
    { title: "Quarterly review — Northwind", status: "in_progress" },
    { title: "Support ticket backlog", status: "pending" },
  ],
  reports: [
    { title: "Monthly KPI report", status: "pending" },
    { title: "Sales pipeline export", status: "on_hold" },
    { title: "Analytics audit", status: "in_progress" },
  ],
};

export async function ensureWorkItemsForSection(section) {
  const defaults = DEFAULT_ITEMS[section];
  if (!defaults) return [];

  await connectDB();

  const count = await WorkItem.countDocuments({ section });
  if (count === 0) {
    await WorkItem.insertMany(
      defaults.map((entry) => ({
        section,
        title: entry.title,
        status: entry.status,
      })),
    );
  }

  return WorkItem.find({ section }).sort({ createdAt: 1 }).lean();
}
