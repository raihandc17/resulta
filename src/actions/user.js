"use server";

import { revalidatePath } from "next/cache";

import {
  DASHBOARD_SECTIONS,
  resolveSidebarItems,
} from "@/lib/dashboardNav";
import { requireCurrentUser } from "@/lib/authServer";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/session";
import {
  patchUserDocument,
  readUserSidebarOrder,
} from "@/lib/userDocument";

const VALID_IDS = new Set(DASHBOARD_SECTIONS.map((item) => item.id));

function normalizeSidebarOrder(orderedIds) {
  if (!Array.isArray(orderedIds)) {
    return null;
  }

  const seen = new Set();
  const cleaned = [];

  for (const id of orderedIds) {
    if (typeof id === "string" && VALID_IDS.has(id) && !seen.has(id)) {
      seen.add(id);
      cleaned.push(id);
    }
  }

  for (const section of DASHBOARD_SECTIONS) {
    if (!seen.has(section.id)) {
      cleaned.push(section.id);
    }
  }

  return cleaned.length === DASHBOARD_SECTIONS.length ? cleaned : null;
}

export async function saveSidebarOrder(orderedIds) {
  const cleaned = normalizeSidebarOrder(orderedIds);

  if (!cleaned) {
    return { error: "Invalid menu order." };
  }

  try {
    await requireCurrentUser();
    const session = await getSession();
    const userId = session?.userId;

    if (typeof userId !== "string" || !userId) {
      return { error: "Not signed in. Log in and try again." };
    }

    await connectDB();

    const { matched } = await patchUserDocument(userId, {
      sidebarOrder: cleaned,
    });

    if (!matched) {
      return {
        error:
          "Account not found in this app database. Check MONGODB_URI matches the database you view in Atlas.",
      };
    }

    const stored = await readUserSidebarOrder(userId);
    const storedKey = stored?.join("|");
    const expectedKey = cleaned.join("|");

    if (storedKey !== expectedKey) {
      return {
        error:
          "Menu could not be saved to the database. Restart npm run dev and try again.",
      };
    }

    revalidatePath("/dashboard", "layout");

    return {
      success: true,
      items: resolveSidebarItems(cleaned),
    };
  } catch (err) {
    console.error("saveSidebarOrder error:", err);
    return { error: "Could not save menu order." };
  }
}
