import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { ratelimit } from "@/lib/upstash";
import { addUserToPosts } from "@/lib/clerk";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.post
      .findMany({
        take: 100,
        orderBy: {
          createdAt: "desc",
        },
      })
      .then(addUserToPosts);
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      return (await addUserToPosts([post]))[0];
    }),

  getPostsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.post
        .findMany({
          where: {
            authorId: input.userId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 100,
        })
        .then(addUserToPosts);
    }),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji("Only emojis are allowed.").min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;
    }),
});
