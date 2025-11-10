import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { events, type InsertEvent } from "../../drizzle/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

export const eventsRouter = router({
  getEvents: publicProcedure
    .input(
      z.object({
        event_type: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const result = await db
        .select()
        .from(events)
        .limit(input.limit)
        .offset(input.offset);

      return result;
    }),

  logEvent: publicProcedure
    .input(
      z.object({
        event_type: z.string(),
        target_id: z.string().optional(),
        target_type: z.string().optional(),
        metadata: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const eventId = uuidv4();
      const eventData = {
        id: eventId,
        event_type: input.event_type,
        target_id: input.target_id || null,
        target_type: input.target_type || null,
        meta: input.metadata || null,
        created_at: new Date(),
      };
      await db.insert(events).values(eventData as any);

      return { success: true, eventId };
    }),
});
