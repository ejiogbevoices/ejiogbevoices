import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { elders, recordings } from "../../drizzle/schema";

export const eldersRouter = router({
  /**
   * Get all elders (public)
   */
  list: publicProcedure
    .input(
      z.object({
        tradition_id: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      if (input.tradition_id) {
        return await db
          .select()
          .from(elders)
          .where(eq(elders.tradition_id, input.tradition_id))
          .limit(input.limit)
          .offset(input.offset);
      }

      return await db
        .select()
        .from(elders)
        .limit(input.limit)
        .offset(input.offset);
    }),

  /**
   * Get a single elder by ID (public)
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const result = await db
        .select()
        .from(elders)
        .where(eq(elders.id, input.id))
        .limit(1);

      if (!result || result.length === 0) {
        throw new Error("Elder not found");
      }

      return result[0];
    }),

  /**
   * Get recordings for an elder
   */
  getRecordings: publicProcedure
    .input(
      z.object({
        elder_id: z.string(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const result = await db
        .select()
        .from(recordings)
        .where(eq(recordings.elder_id, input.elder_id))
        .limit(input.limit)
        .offset(input.offset);

      return result;
    }),

  /**
   * Create a new elder (protected - admin only)
   */
  create: protectedProcedure
    .input(
      z.object({
        tradition_id: z.string(),
        name: z.string().min(1),
        lineage: z.string().optional(),
        bio: z.string().optional(),
        photo_url: z.string().optional(),
        languages: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Check if user is admin
      if (ctx.user?.role !== "admin") {
        throw new Error("Only admins can create elders");
      }

      const elderId = `elder-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      await db.insert(elders).values({
        id: elderId,
        tradition_id: input.tradition_id,
        name: input.name,
        lineage: input.lineage,
        bio: input.bio,
        photo_url: input.photo_url,
        languages: input.languages,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return { id: elderId, ...input };
    }),

  /**
   * Update an elder (protected - admin only)
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        lineage: z.string().optional(),
        bio: z.string().optional(),
        photo_url: z.string().optional(),
        languages: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Check if user is admin
      if (ctx.user?.role !== "admin") {
        throw new Error("Only admins can update elders");
      }

      const { id, ...updateData } = input;

      await db
        .update(elders)
        .set({
          ...updateData,
          updated_at: new Date(),
        })
        .where(eq(elders.id, id));

      return { id, ...updateData };
    }),

  /**
   * Delete an elder (protected - admin only)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Check if user is admin
      if (ctx.user?.role !== "admin") {
        throw new Error("Only admins can delete elders");
      }

      await db.delete(elders).where(eq(elders.id, input.id));

      return { success: true };
    }),
});
