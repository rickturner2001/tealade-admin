import { createTRPCRouter, publicProcedure } from "../trpc";
import { protectedProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  // Read
  getAllCategories: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.category.findMany();
  }),
});
