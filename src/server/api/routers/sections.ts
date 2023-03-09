import { createTRPCRouter } from "../trpc";
import { protectedProcedure } from "../trpc";

export const sectionRouter = createTRPCRouter({
  // READ
  getAllSections: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.shopSection.findMany();
  }),
});
