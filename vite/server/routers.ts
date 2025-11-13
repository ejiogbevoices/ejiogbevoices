import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { recordingsRouter, transcriptRouter, translationsRouter } from "./routers/recordings";
import { uploadRouter } from "./routers/upload";
import { dubbingRouter } from "./routers/dubbing";
import { eldersRouter } from "./routers/elders";
import { playlistsRouter } from "./routers/playlists";
import { reviewTasksRouter } from "./routers/reviewTasks";
import { eventsRouter } from "./routers/events";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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

  recordings: recordingsRouter,
  transcript: transcriptRouter,
  translations: translationsRouter,
  upload: uploadRouter,
  dubbing: dubbingRouter,
  elders: eldersRouter,
  playlists: playlistsRouter,
  reviewTasks: reviewTasksRouter,
  events: eventsRouter,
});

export type AppRouter = typeof appRouter;
