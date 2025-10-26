import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  user: router({
    getProfile: protectedProcedure
      .input(z.object({ userId: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        const userId = input.userId || ctx.user.id;
        const user = await db.getUserById(userId);
        if (!user) throw new Error("User not found");
        
        // Get average rating
        const avgRating = await db.getAverageRating(userId);
        const reviews = await db.getReviewsByUser(userId);
        
        return {
          ...user,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
        };
      }),

    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        cpfCnpj: z.string().optional(),
        bio: z.string().optional(),
        experience: z.string().optional(),
        area: z.string().optional(),
        location: z.string().optional(),
        userType: z.enum(["freelancer", "company"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  jobs: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        location: z.string().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const jobs = await db.getJobs(input);
        
        // Enrich with company info
        const enrichedJobs = await Promise.all(
          jobs.map(async (job) => {
            const company = await db.getUserById(job.companyId);
            return {
              ...job,
              companyName: company?.name || "Empresa",
              companyLocation: company?.location,
            };
          })
        );
        
        return enrichedJobs;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const job = await db.getJobById(input.id);
        if (!job) throw new Error("Job not found");
        
        const company = await db.getUserById(job.companyId);
        const applications = await db.getApplicationsByJob(input.id);
        
        return {
          ...job,
          company,
          applicationCount: applications.length,
        };
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(5),
        description: z.string().min(20),
        category: z.string(),
        location: z.string(),
        salary: z.string().optional(),
        workDate: z.string().optional(),
        requirements: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (user?.userType !== "company") {
          throw new Error("Only companies can post jobs");
        }
        
        const result = await db.createJob({
          ...input,
          companyId: ctx.user.id,
        });
        
        return { success: true, jobId: result };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(5).optional(),
        description: z.string().min(20).optional(),
        category: z.string().optional(),
        location: z.string().optional(),
        salary: z.string().optional(),
        workDate: z.string().optional(),
        requirements: z.string().optional(),
        status: z.enum(["open", "closed"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updateData } = input;
        
        // Verificar se a vaga pertence ao usuário
        const job = await db.getJobById(id);
        if (!job) throw new Error("Job not found");
        if (job.companyId !== ctx.user.id) {
          throw new Error("You can only edit your own jobs");
        }
        
        await db.updateJob(id, updateData);
        return { success: true };
      }),

    myJobs: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getJobsByCompany(ctx.user.id);
      }),
  }),

  applications: router({
    applyToJob: protectedProcedure
      .input(z.object({
        jobId: z.number(),
        message: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (user?.userType !== "freelancer") {
          throw new Error("Only freelancers can apply to jobs");
        }
        
        const result = await db.createApplication({
          jobId: input.jobId,
          freelancerId: ctx.user.id,
          message: input.message,
        });
        
        return { success: true, applicationId: result };
      }),

    myApplications: protectedProcedure
      .query(async ({ ctx }) => {
        const applications = await db.getApplicationsByFreelancer(ctx.user.id);
        
        // Enrich with job info
        const enriched = await Promise.all(
          applications.map(async (app) => {
            const job = await db.getJobById(app.jobId);
            return { ...app, job };
          })
        );
        
        return enriched;
      }),

    byJob: protectedProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ ctx, input }) => {
        const job = await db.getJobById(input.jobId);
        if (!job || job.companyId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        
        const applications = await db.getApplicationsByJob(input.jobId);
        
        // Enrich with freelancer info
        const enriched = await Promise.all(
          applications.map(async (app) => {
            const freelancer = await db.getUserById(app.freelancerId);
            return { ...app, freelancer };
          })
        );
        
        return enriched;
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "accepted", "rejected"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateApplicationStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  reviews: router({
    create: protectedProcedure
      .input(z.object({
        reviewedId: z.number(),
        jobId: z.number().optional(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.createReview({
          reviewerId: ctx.user.id,
          ...input,
        });
        
        return { success: true, reviewId: result };
      }),

    byUser: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        const reviews = await db.getReviewsByUser(input.userId);
        
        // Enrich with reviewer info
        const enriched = await Promise.all(
          reviews.map(async (review) => {
            const reviewer = await db.getUserById(review.reviewerId);
            return { ...review, reviewer };
          })
        );
        
        return enriched;
      }),

    stats: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        const reviews = await db.getReviewsByUser(input.userId);
        const avgRating = await db.getAverageRating(input.userId);
        
        return {
          total: reviews.length,
          average: Math.round(avgRating * 10) / 10,
        };
      }),
  }),

  chats: router({
    list: protectedProcedure
      .query(async ({ ctx }) => {
        const chats = await db.getChatsByUser(ctx.user.id);
        
        // Enrich with other user info and last message
        const enriched = await Promise.all(
          chats.map(async (chat) => {
            const otherUserId = chat.userAId === ctx.user.id ? chat.userBId : chat.userAId;
            const otherUser = await db.getUserById(otherUserId);
            const messages = await db.getMessagesByChat(chat.id);
            const lastMessage = messages[messages.length - 1];
            
            return {
              ...chat,
              otherUser,
              lastMessage,
            };
          })
        );
        
        return enriched;
      }),

    getOrCreate: protectedProcedure
      .input(z.object({
        otherUserId: z.number(),
        jobId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if chat already exists
        let chat = await db.findExistingChat(ctx.user.id, input.otherUserId);
        
        if (!chat) {
          // Create new chat
          const result = await db.createChat({
            userAId: ctx.user.id,
            userBId: input.otherUserId,
            jobId: input.jobId,
          });
          
          // Get the created chat - fetch by users
          chat = await db.findExistingChat(ctx.user.id, input.otherUserId);
        }
        
        return chat;
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const chat = await db.getChatById(input.id);
        if (!chat) throw new Error("Chat not found");
        
        // Verify user is part of chat
        if (chat.userAId !== ctx.user.id && chat.userBId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        
        const otherUserId = chat.userAId === ctx.user.id ? chat.userBId : chat.userAId;
        const otherUser = await db.getUserById(otherUserId);
        
        return {
          ...chat,
          otherUser,
        };
      }),
  }),

  messages: router({
    list: protectedProcedure
      .input(z.object({ chatId: z.number() }))
      .query(async ({ ctx, input }) => {
        const chat = await db.getChatById(input.chatId);
        if (!chat) throw new Error("Chat not found");
        
        // Verify user is part of chat
        if (chat.userAId !== ctx.user.id && chat.userBId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        
        return await db.getMessagesByChat(input.chatId);
      }),

    send: protectedProcedure
      .input(z.object({
        chatId: z.number(),
        content: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const chat = await db.getChatById(input.chatId);
        if (!chat) throw new Error("Chat not found");
        
        // Verify user is part of chat
        if (chat.userAId !== ctx.user.id && chat.userBId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        
        const result = await db.createMessage({
          chatId: input.chatId,
          senderId: ctx.user.id,
          content: input.content,
        });
        
        return { success: true, messageId: result };
      }),

    markAsRead: protectedProcedure
      .input(z.object({ chatId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.markMessagesAsRead(input.chatId, ctx.user.id);
        return { success: true };
      }),

    unreadCount: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getUnreadMessageCount(ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;

