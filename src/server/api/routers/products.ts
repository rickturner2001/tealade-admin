import { requestProductById, requestShipmentByVid } from "~/functions";
import { createTRPCRouter } from "../trpc";
import { protectedProcedure } from "../trpc";
import {
  productCopyUpdateSchema,
  productPidSchema,
  productRegistrationSchema,
  productShipmentUpdateSchema,
  productTagSchema,
  productThumbnailupdateSchema,
} from "~/schemas";
import { ProductWithShipmentAndVariants } from "~/types";
import { Shipment } from "@prisma/client";

export const productRouter = createTRPCRouter({
  // CREATE

  // Register product and automatically default the shiment options
  blindProductRegistration: protectedProcedure
    .input(productPidSchema)
    .mutation(async ({ ctx, input }) => {
      const productData = await requestProductById(input.pid);

      if (productData.data) {
        const shipmentData = await requestShipmentByVid(
          productData.data.variants[0].vid
        );
        if (shipmentData.data) {
          const product = productData.data;

          const shipments = shipmentData.data;

          return await ctx.prisma.product.create({
            data: {
              pid: product.pid,
              category: {
                connectOrCreate: {
                  where: {
                    cid: product.categoryId,
                  },
                  create: {
                    cid: product.categoryId,
                    label: product.categoryName,
                  },
                },
              },
              defaultThumbnail: product.productImageSet[0],
              isImport: true,
              description: product.description,
              name: product.entryNameEn,
              imageSet: product.productImageSet,
              variants: {
                createMany: {
                  data: product.variants.map((variant) => {
                    return {
                      price: variant.variantSellPrice,
                      variantName: variant.variantNameEn,
                      height: variant.variantHeight,
                      width: variant.variantWidth,
                      vid: variant.vid,
                      thumbnail: variant.variantImage,
                    };
                  }),
                },
              },
              shipments: {
                createMany: {
                  data: shipments.map((shipment) => {
                    return {
                      cost: shipment.logisticPrice,
                      courier: shipment.logisticName,
                      est: shipment.logisticAging,
                    };
                  }),
                },
              },
            },
          });
        }
      }
    }),
  pushProductToImports: protectedProcedure
    .input(productRegistrationSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.update({
        where: {
          pid: input.pid,
        },
        data: {
          defaultThumbnail: input.defaultThumbnail,
          isImport: input.isImport,
          isStore: input.isStore,
          description: input.description,
          name: input.name,
          sections: input.sectionId
            ? {
                connect: {
                  id: input.sectionId,
                },
              }
            : undefined,
          imageSet: input.imageSet,
          category: {
            connectOrCreate: {
              where: {
                cid: input.categoryId,
              },
              create: {
                cid: input.categoryId,
                label: input.categoryLabel,
              },
            },
          },

          variants: {
            updateMany: input.variants.map((variant) => {
              return {
                where: {
                  vid: variant.vid,
                },
                data: {
                  price: variant.price,
                },
              };
            }),
          },

          shipments: {
            createMany: {
              data: input.shipments.map((shipment) => {
                return {
                  cost: shipment.cost,
                  courier: shipment.courier,
                  est: shipment.est,
                };
              }),
            },
          },
        },
      });
    }),

  registerProduct: protectedProcedure
    .input(productRegistrationSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.create({
        data: {
          pid: input.pid,
          defaultThumbnail: input.defaultThumbnail,
          isImport: input.isImport,
          isStore: input.isStore,
          description: input.description,
          name: input.name,
          sections: input.sectionId
            ? {
                connect: {
                  id: input.sectionId,
                },
              }
            : undefined,
          imageSet: input.imageSet,
          category: {
            connectOrCreate: {
              where: {
                cid: input.categoryId,
              },
              create: {
                cid: input.categoryId,
                label: input.categoryLabel,
              },
            },
          },

          variants: {
            connectOrCreate: input.variants.map((variant) => {
              return {
                where: {
                  vid: variant.vid,
                },
                create: {
                  height: variant.height,
                  price: variant.price,
                  thumbnail: variant.image,
                  variantName: variant.name,
                  vid: variant.vid,
                  width: variant.width,
                },
              };
            }),
          },

          shipments: {
            createMany: {
              data: input.shipments.map((shipment) => {
                return {
                  cost: shipment.cost,
                  courier: shipment.courier,
                  est: shipment.est,
                };
              }),
            },
          },
        },
      });
    }),

  findOrRequestId: protectedProcedure
    .input(productPidSchema)
    .query(async ({ ctx, input }) => {
      const product: ProductWithShipmentAndVariants | null =
        await ctx.prisma.product.findUnique({
          where: {
            pid: input.pid,
          },
          include: {
            variants: true,
            category: true,
            shipments: true,
          },
        });

      if (product) {
        return product;
      }

      return await requestProductById(input.pid);
    }),

  createProductTag: protectedProcedure
    .input(productTagSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.productTag.create({
        data: {
          productId: input.pid,
          label: input.label,
        },
      });
    }),

  //READ

  getAllProducts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.product.findMany();
  }),

  getAllStoreProducts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.product.findMany({
      where: {
        isStore: true,
      },
      include: {
        sections: true,
        tags: true,
        discount: true,
        variants: {
          orderBy: {
            price: "asc",
          },
        },
      },
    });
  }),

  getAllImportedProducts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.product.findMany({
      where: {
        isImport: true,
      },
      include: {
        tags: true,
        category: true,
        variants: true,
        shipments: true,
      },

      orderBy: {
        updatedAt: "desc",
      },
    });
  }),

  getAllDiscountedProducts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.product.findMany({
      take: 8,
      where: {
        discountId: {
          not: null,
        },
      },
      include: {
        discount: true,
        category: true,
        variants: true,
        sections: true,
        shipments: true,
      },
    });
  }),

  // UPDATE
  updateProductsCopy: protectedProcedure
    .input(productCopyUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.update({
        where: {
          pid: input.pid,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),

  updateProductThumbnail: protectedProcedure
    .input(productThumbnailupdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.update({
        where: {
          pid: input.pid,
        },
        data: {
          defaultThumbnail: input.newThumbnail,
        },
      });
    }),

  updateProductRemoveFromStore: protectedProcedure
    .input(productPidSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.update({
        where: {
          pid: input.pid,
        },
        data: {
          isImport: true,
          isStore: false,
        },
      });
    }),

  updateProductShipments: protectedProcedure
    .input(productShipmentUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.update({
        where: {
          pid: input.pid,
        },
        data: {
          shipments: {
            deleteMany: {},
            create: input.shipments.map((ship) => {
              return {
                cost: ship.cost,
                courier: ship.courier,
                est: ship.est,
              } as Shipment;
            }),
          },
        },
      });
    }),

  // Delete
  deleteProduct: protectedProcedure
    .input(productPidSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.delete({
        where: {
          pid: input.pid,
        },
      });
    }),

  deleteProductTag: protectedProcedure
    .input(productTagSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.productTag.delete({
        where: {
          label_productId: {
            label: input.label,
            productId: input.pid,
          },
        },
      });
    }),
});
