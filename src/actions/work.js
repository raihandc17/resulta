"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/lib/authServer";
import { connectDB } from "@/lib/db";
import { isAdminRole } from "@/lib/roles";
import { WORK_STATUSES } from "@/lib/workBoard";
import WorkItem from "@/models/WorkItem";

const VALID_STATUS = new Set(WORK_STATUSES.map((entry) => entry.value));

export async function updateWorkItemStatus(workItemId, nextStatus) {
  if (typeof workItemId !== "string" || !workItemId) {
    return { error: "Invalid work item." };
  }

  if (typeof nextStatus !== "string" || !VALID_STATUS.has(nextStatus)) {
    return { error: "Invalid status." };
  }

  try {
    const user = await requireCurrentUser();

    if (!isAdminRole(user.role)) {
      return { error: "Only admins can update work progress." };
    }

    await connectDB();

    const item = await WorkItem.findByIdAndUpdate(
      workItemId,
      { status: nextStatus },
      { new: true },
    );

    if (!item) {
      return { error: "Work item not found." };
    }

    revalidatePath(`/dashboard/${item.section}`);

    return { success: true };
  } catch (err) {
    console.error("updateWorkItemStatus error:", err);
    return { error: "Update failed." };
  }
}
