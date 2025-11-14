import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { review_tasks } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const reviewTasksRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "approved", "rejected"]).optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const tasks = await db
        .select()
        .from(review_tasks)
        .limit(input.limit)
        .offset(input.offset);

      return tasks;
    }),

  approve: protectedProcedure
    .input(
      z.object({
        task_id: z.string(),
        approved: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const status = input.approved ? "approved" : "rejected";

      await db
        .update(review_tasks)
        .set({ status })
        .where(eq(review_tasks.id, input.task_id));

      return { success: true, status };
    }),

  reject: protectedProcedure
    .input(
      z.object({
        task_id: z.string(),
        approved: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const status = input.approved ? "approved" : "rejected";

      await db
        .update(review_tasks)
        .set({ status })
        .where(eq(review_tasks.id, input.task_id));

      return { success: true, status };
    }),
});
