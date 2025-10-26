import { eq, desc, and, or, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  jobs, InsertJob, Job,
  applications, InsertApplication,
  reviews, InsertReview,
  chats, InsertChat,
  messages, InsertMessage
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER FUNCTIONS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone", "bio", "experience", "area", "location", "profileImage"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (user.userType !== undefined) {
      values.userType = user.userType;
      updateSet.userType = user.userType;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, userId));
}

// ============ JOB FUNCTIONS ============

export async function createJob(job: InsertJob) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(jobs).values(job);
  return result;
}

export async function getJobs(filters?: { category?: string; location?: string; search?: string }) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(jobs.status, "open")];
  
  if (filters?.category) {
    conditions.push(eq(jobs.category, filters.category));
  }
  
  const result = await db.select().from(jobs).where(and(...conditions)).orderBy(desc(jobs.createdAt));
  return result;
}

export async function getJobById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getJobsByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(jobs).where(eq(jobs.companyId, companyId)).orderBy(desc(jobs.createdAt));
}

export async function updateJob(id: number, data: Partial<InsertJob>) {
  const db = await getDb();
  if (!db) return;
  await db.update(jobs).set(data).where(eq(jobs.id, id));
}

// ============ APPLICATION FUNCTIONS ============

export async function createApplication(application: InsertApplication) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(applications).values(application);
  return result;
}

export async function getApplicationsByJob(jobId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(applications).where(eq(applications.jobId, jobId)).orderBy(desc(applications.createdAt));
}

export async function getApplicationsByFreelancer(freelancerId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(applications).where(eq(applications.freelancerId, freelancerId)).orderBy(desc(applications.createdAt));
}

export async function updateApplicationStatus(id: number, status: "pending" | "accepted" | "rejected") {
  const db = await getDb();
  if (!db) return;
  await db.update(applications).set({ status }).where(eq(applications.id, id));
}

// ============ REVIEW FUNCTIONS ============

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(reviews).values(review);
  return result;
}

export async function getReviewsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(reviews).where(eq(reviews.reviewedId, userId)).orderBy(desc(reviews.createdAt));
}

export async function getAverageRating(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ avg: sql<number>`AVG(${reviews.rating})` })
    .from(reviews)
    .where(eq(reviews.reviewedId, userId));
  return result[0]?.avg || 0;
}

// ============ CHAT FUNCTIONS ============

export async function createChat(chat: InsertChat) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(chats).values(chat);
  return result;
}

export async function getChatById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(chats).where(eq(chats.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getChatsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(chats)
    .where(or(eq(chats.userAId, userId), eq(chats.userBId, userId)))
    .orderBy(desc(chats.updatedAt));
}

export async function findExistingChat(userAId: number, userBId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(chats)
    .where(
      or(
        and(eq(chats.userAId, userAId), eq(chats.userBId, userBId)),
        and(eq(chats.userAId, userBId), eq(chats.userBId, userAId))
      )
    )
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============ MESSAGE FUNCTIONS ============

export async function createMessage(message: InsertMessage) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(messages).values(message);
  
  // Update chat updatedAt
  await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, message.chatId));
  
  return result;
}

export async function getMessagesByChat(chatId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(messages).where(eq(messages.chatId, chatId)).orderBy(messages.createdAt);
}

export async function markMessagesAsRead(chatId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(messages)
    .set({ isRead: true })
    .where(and(eq(messages.chatId, chatId), eq(messages.senderId, userId)));
}

export async function getUnreadMessageCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  // Get all chats for user
  const userChats = await getChatsByUser(userId);
  const chatIds = userChats.map(c => c.id);
  
  if (chatIds.length === 0) return 0;
  
  const result = await db.select({ count: sql<number>`COUNT(*)` })
    .from(messages)
    .where(
      and(
        sql`${messages.chatId} IN (${sql.join(chatIds.map(id => sql`${id}`), sql`, `)})`,
        eq(messages.isRead, false),
        sql`${messages.senderId} != ${userId}`
      )
    );
  
  return result[0]?.count || 0;
}

