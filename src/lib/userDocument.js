import mongoose from "mongoose";

import { connectDB } from "@/lib/db";

const USERS_COLLECTION = "users";

function toObjectId(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  return new mongoose.Types.ObjectId(userId);
}

/** Writes user fields without Mongoose strict-mode stripping (dev hot-reload safe). */
export async function patchUserDocument(userId, fields) {
  await connectDB();

  const objectId = toObjectId(userId);
  if (!objectId) {
    return { matched: false, modified: false };
  }

  const result = await mongoose.connection.db.collection(USERS_COLLECTION).updateOne(
    { _id: objectId },
    {
      $set: {
        ...fields,
        updatedAt: new Date(),
      },
    },
  );

  return {
    matched: result.matchedCount > 0,
    modified: result.modifiedCount > 0,
  };
}

export async function readUserSidebarOrder(userId) {
  await connectDB();

  const objectId = toObjectId(userId);
  if (!objectId) {
    return null;
  }

  const doc = await mongoose.connection.db
    .collection(USERS_COLLECTION)
    .findOne({ _id: objectId }, { projection: { sidebarOrder: 1 } });

  return Array.isArray(doc?.sidebarOrder) ? doc.sidebarOrder : null;
}
