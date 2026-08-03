import { connectDB } from "@/lib/db";
import { isAdminRole } from "@/lib/roles";
import { normalizeSubmissionStatus } from "@/lib/submissionStatus";
import ContactMessage from "@/models/ContactMessage";

export async function listSubmissionsForDashboard(user) {
  await connectDB();

  const query = isAdminRole(user.role)
    ? {}
    : {
        $or: [{ email: user.email.toLowerCase() }, { userId: user._id }],
      };

  const rows = await ContactMessage.find(query)
    .sort({ createdAt: -1 })
    .lean();

  return rows.map((row) => ({
    id: String(row._id),
    name: row.name,
    email: row.email,
    message: row.message,
    status: normalizeSubmissionStatus(row.status),
    createdAt: row.createdAt?.toISOString?.() ?? new Date().toISOString(),
  }));
}
