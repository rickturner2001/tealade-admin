import { z } from "zod";

export const productRegistrationSchema = z.object({
  pid: z.string(),
  name: z.string(),
  description: z.string(),
  isStore: z.boolean(),
  isImport: z.boolean(),
  sectionId: z.string().nullable(),
  categoryId: z.string(),
  categoryLabel: z.string(),
  variants: z
    .object({
      vid: z.string(),
      price: z.number(),
      name: z.string(),
      image: z.string(),
      height: z.number(),
      width: z.number(),
    })
    .array(),
  defaultThumbnail: z.string(),
  imageSet: z.string().array(),
  shipments: z
    .object({ courier: z.string(), est: z.string(), cost: z.number() })
    .array(),
});

export const productPidSchema = z.object({ pid: z.string() });
export const productVidSchema = z.object({ vid: z.string() });

export const productSearchSchema = z.object({
  pageNum: z.number(),
  perPage: z.number(),
  categoryKeyword: z.string().nullable(),
});

export const productCopyUpdateSchema = z.object({
  pid: z.string(),
  name: z.string(),
  description: z.string(),
});

// Estimated time is a string, since ranges (n - n) default to a string
const productShipment = z.object({
  cost: z.number(),
  courier: z.string(),
  est: z.string(),
});

export const productThumbnailupdateSchema = z.object({
  pid: z.string(),
  newThumbnail: z.string(),
});

// Length of shipments is 2. [0] is reserved for economy shipping options
export const productShipmentUpdateSchema = z.object({
  pid: z.string(),
  shipments: productShipment.array().length(2),
});

export const productTagSchema = z.object({
  pid: z.string(),
  label: z.string(),
});
