/* eslint-disable @typescript-eslint/no-empty-function */
import { type Dispatch, type SetStateAction, createContext } from "react";
import type { PrettyShipment, PrettyVariant, ProductWithTags } from "~/types";

interface ImportedProductsContextValue {
  product: ProductWithTags;
  productName: string;
  productDescription: string;
  productSection: string;
  defaultThumbnail: string;
  imagesSet: string[];
  shipments: PrettyShipment[];
  variants: PrettyVariant[];
  setProductName: Dispatch<SetStateAction<string>>;
  setProductDescription: Dispatch<SetStateAction<string>>;
  setDefaultThumbnail: Dispatch<SetStateAction<string>>;
  setImagesSet: Dispatch<SetStateAction<string[]>>;
  setSection: Dispatch<SetStateAction<string>>;
  setShipments: Dispatch<SetStateAction<PrettyShipment[]>>;
  setVariants: Dispatch<SetStateAction<PrettyVariant[]>>;
  setMargin: Dispatch<SetStateAction<number>>;
  margin: number;
}

export const ImportedProductsContext =
  createContext<ImportedProductsContextValue>({
    defaultThumbnail: "",
    imagesSet: [],
    product: {
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
    setMargin: () => {},

    variants: [],
    setDefaultThumbnail: () => {},
    setImagesSet: () => {},
    setProductDescription: () => {},
    setProductName: () => {},
    setSection: () => {},
    setShipments: () => {},
    setVariants: () => {},
  });
