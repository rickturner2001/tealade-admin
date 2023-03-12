/* eslint-disable @typescript-eslint/no-empty-function */
import type { Shipment, ShopSection } from "@prisma/client";
import { type Dispatch, type SetStateAction, createContext } from "react";
import type { PrettyVariant, ProductWithTags } from "~/types";

interface ImportedProductsContextValue {
  product: ProductWithTags;
  productName: string;
  productDescription: string;
  productSection: string;
  defaultThumbnail: string;
  imagesSet: string[];
  shipments: Shipment[];
  variants: PrettyVariant[];
  setProductName: Dispatch<SetStateAction<string>>;
  setProductDescription: Dispatch<SetStateAction<string>>;
  setDefaultThumbnail: Dispatch<SetStateAction<string>>;
  section: string;
  setSection: Dispatch<SetStateAction<string>>;
  setImagesSet: Dispatch<SetStateAction<string[]>>;
  setShipments: Dispatch<SetStateAction<Shipment[]>>;
  setMargin: Dispatch<SetStateAction<number>>;
  setVariants: Dispatch<SetStateAction<PrettyVariant[]>>;
  margin: number;
}

export const ImportedProductsContext =
  createContext<ImportedProductsContextValue>({
    section: "",
    defaultThumbnail: "",
    imagesSet: [],
    product: {
      sections: [],
      category: {
        cid: "",
        label: "",
      },
      categoryId: "",
      defaultThumbnail: "",
      description: "",
      discountId: "",
      imageSet: [""],
      isImport: false,
      isStore: false,
      updatedAt: new Date(),
      name: "",
      pid: "",
      variants: [],
      shipments: [],
      tags: [],
    },
    productDescription: "",
    productName: "",
    productSection: "",
    shipments: [],
    margin: 0,

    variants: [],
    setDefaultThumbnail: () => {},
    setMargin: () => {},
    setImagesSet: () => {},
    setProductDescription: () => {},
    setProductName: () => {},
    setSection: () => {},

    setShipments: () => {},
    setVariants: () => {},
  });
