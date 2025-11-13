import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { playlists, playlist_items, recordings } from "../../drizzle/schema";

export const playlistsRouter = router({
  /**
   * Get all public playlists
   */
  listPublic: publicProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db
        .select()
        .from(playlists)
        .where(eq(playlists.visibility, "public"))
        .limit(input.limit)
        .offset(input.offset);
    }),

  /**
   * Get user's playlists
   */
  listMine: protectedProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db
        .select()
        .from(playlists)
        .where(eq(playlists.owner, ctx.user?.id || ""))
        .limit(input.limit)
        .offset(input.offset);
    }),

  /**
   * Get a single playlist with items
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const playlistResult = await db
        .select()
        .from(playlists)
        .where(eq(playlists.id, input.id))
        .limit(1);

      if (!playlistResult || playlistResult.length === 0) {
        throw new Error("Playlist not found");
      }

      const items = await db
        .select()
        .from(playlist_items)
        .where(eq(playlist_items.playlist_id, input.id));

      return {
        ...playlistResult[0],
        items,
      };
    }),

  /**
   * Create a new playlist
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        visibility: z.enum(["public", "private", "unlisted"]).default("private"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const playlistId = `pl-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      await db.insert(playlists).values({
        id: playlistId,
        title: input.title,
        description: input.description,
        visibility: input.visibility,
        owner: ctx.user?.id || "",
        created_at: new Date(),
        updated_at: new Date(),
      });

      return { id: playlistId, ...input };
    }),

  /**
   * Update a playlist
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        visibility: z.enum(["public", "private", "unlisted"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...updateData } = input;

      await db
        .update(playlists)
        .set({
          ...updateData,
          updated_at: new Date(),
        })
        .where(eq(playlists.id, id));

      return { id, ...updateData };
    }),

  /**
   * Delete a playlist
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Delete items first
      await db.delete(playlist_items).where(eq(playlist_items.playlist_id, input.id));

      // Delete playlist
      await db.delete(playlists).where(eq(playlists.id, input.id));

      return { success: true };
    }),

  /**
   * Add item to playlist
   */
  addItem: protectedProcedure
    .input(
      z.object({
        playlist_id: z.string(),
        recording_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get the current max order
      const items = await db
        .select()
        .from(playlist_items)
        .where(eq(playlist_items.playlist_id, input.playlist_id));

      const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.order || 0)) + 1 : 0;

      const itemId = `pi-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      await db.insert(playlist_items).values({
        id: itemId,
        playlist_id: input.playlist_id,
        recording_id: input.recording_id,
        order: maxOrder,
        added_at: new Date(),
      });

      return { ...input, order: maxOrder };
    }),

  /**
   * Remove item from playlist
   */
  removeItem: protectedProcedure
    .input(z.object({ item_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(playlist_items).where(eq(playlist_items.id, input.item_id));

      return { success: true };
    }),

  /**
   * Reorder playlist items
   */
  reorderItems: protectedProcedure
    .input(
      z.object({
        playlist_id: z.string(),
        item_ids: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Update order based on array position
      for (let i = 0; i < input.item_ids.length; i++) {
        await db
          .update(playlist_items)
          .set({ order: i })
          .where(eq(playlist_items.id, input.item_ids[i]));
      }

      return { success: true };
    }),
});
