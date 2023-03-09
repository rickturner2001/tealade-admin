import { createTRPCRouter } from "~/server/api/trpc";
import { cjRouter } from "./routers/cj_api";
import { productRouter } from "./routers/products";
import { categoryRouter } from "./routers/categories";
import { sectionRouter } from "./routers/sections";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  cjApi: cjRouter,
  products: productRouter,
  categories: categoryRouter,
  sections: sectionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
