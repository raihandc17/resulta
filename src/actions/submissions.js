"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/lib/authServer";
import { connectDB } from "@/lib/db";
import { isAdminRole } from "@/lib/roles";
import { SUBMISSION_STATUSES } from "@/lib/submissionStatus";
import ContactMessage from "@/models/ContactMessage";

const VALID_STATUS = new Set(SUBMISSION_STATUSES.map((entry) => entry.value));

export async function updateSubmissionStatus(submissionId, nextStatus) {
  if (typeof submissionId !== "string" || !submissionId) {
    return { error: "Invalid submission." };
  }

  if (typeof nextStatus !== "string" || !VALID_STATUS.has(nextStatus)) {
    return { error: "Invalid status." };
  }

  try {
    const user = await requireCurrentUser();

    if (!isAdminRole(user.role)) {
      return { error: "Only admins can update status." };
    }

    await connectDB();

    const updated = await ContactMessage.findByIdAndUpdate(
      submissionId,
      { status: nextStatus },
      { new: true },
    ).lean();

    if (!updated) {
      return { error: "Submission not found." };
    }

    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/projects");

    return { success: true };
  } catch (err) {
    console.error("updateSubmissionStatus error:", err);
    return { error: "Could not update status." };
  }
}
