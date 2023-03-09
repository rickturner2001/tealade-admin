import {
  requestProductById,
  requestProductList,
  requestShipmentByVid,
} from "~/functions";
import {
  productPidSchema,
  productSearchSchema,
  productVidSchema,
} from "~/schemas";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

// Request products from CJ-API. Must be logged in
export const cjRouter = createTRPCRouter({
  getListProducts: protectedProcedure
    .input(productSearchSchema)
    .query(async ({ input }) => {
      return await requestProductList(
        input.perPage,
        input.pageNum,
        input.categoryKeyword
      );
    }),

  // Send a request to the CjAPI
  requestProductByID: protectedProcedure
    .input(productPidSchema)
    .query(async ({ input }) => {
      return await requestProductById(input.pid);
    }),

  requestShipmentByVid: publicProcedure
    .input(productVidSchema)
    .query(async ({ input }) => {
      return await requestShipmentByVid(input.vid);
    }),
});
