import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Campos específicos do Freelancer Now
  userType: mysqlEnum("userType", ["freelancer", "company"]).default("freelancer").notNull(),
  cpfCnpj: varchar("cpfCnpj", { length: 18 }), // CPF para freelancers, CNPJ para empresas
  phone: varchar("phone", { length: 20 }),
  bio: text("bio"),
  experience: text("experience"),
  area: varchar("area", { length: 100 }), // Área de atuação (garçom, cozinheiro, bartender, etc)
  location: varchar("location", { length: 200 }),
  profileImage: text("profileImage"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Jobs/Vagas table
 */
export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(), // ID do usuário que é empresa
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(), // garçom, cozinheiro, bartender, etc
  location: varchar("location", { length: 200 }).notNull(),
  salary: varchar("salary", { length: 100 }),
  workDate: varchar("workDate", { length: 100 }), // Data do trabalho
  requirements: text("requirements"),
  status: mysqlEnum("status", ["open", "closed", "filled"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

/**
 * Applications table - candidaturas
 */
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  freelancerId: int("freelancerId").notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "accepted", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

/**
 * Reviews table - avaliações
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  reviewerId: int("reviewerId").notNull(), // Quem avaliou
  reviewedId: int("reviewedId").notNull(), // Quem foi avaliado
  jobId: int("jobId"), // Vaga relacionada (opcional)
  rating: int("rating").notNull(), // 1-5 estrelas
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Chats table - conversas
 */
export const chats = mysqlTable("chats", {
  id: int("id").autoincrement().primaryKey(),
  userAId: int("userAId").notNull(),
  userBId: int("userBId").notNull(),
  jobId: int("jobId"), // Vaga relacionada (opcional)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Chat = typeof chats.$inferSelect;
export type InsertChat = typeof chats.$inferInsert;

/**
 * Messages table - mensagens do chat
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  chatId: int("chatId").notNull(),
  senderId: int("senderId").notNull(),
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

