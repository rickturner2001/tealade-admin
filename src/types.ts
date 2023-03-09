import type {
  Discount,
  Product,
  ProductTag,
  ProductVariant,
  Shipment,
  ShopSection,
} from "@prisma/client";

// Miscellaneous
export type NonEmptyArray<T> = [T, ...T[]];

// CJ Types
export type CjProduct = {
  pid: string;
  productName: string;
  productNameEn: string;
  productSku: string;
  productImage: string;
  productWeight: number;
  productType: null;
  productUnit: string;
  sellPrice: number;
  categoryId: string;
  categoryName: string;
  sourceFrom: number;
  remark: string;
  createTime: null;
};

export type CjResponseProductSpecifics = {
  code: number;
  result: true;
  message: string;
  data:
    | undefined
    | {
        addMarkStatus: number;
        categoryId: string;
        categoryName: string;
        createrTime: string;
        description: string;
        entryCode: string;
        entryName: string;
        entryNameEn: string;
        listedNum: number;
        materialKey: string;
        materialKeySet: string[];
        materialName: string;
        materialNameEn: string;
        materialNameEnSet: string[];
        materialNameSet: string[];
        packingKey: string;
        packingKeySet: string[];
        packingName: string;
        packingNameEn: string;
        packingNameEnSet: string[];
        packingNameSet: string[];
        packingWeight: string;
        pid: string;
        productImage: string;
        productImageSet: NonEmptyArray<string>;
        productKey: string;
        productKeyEn: string;
        productKeySet: string[];
        productName: string;
        productNameEn: string;
        productNameSet: string[];
        productPro: string;
        productProEn: string;
        productProEnSet: string[];
        productProSet: string[];
        productSku: string;
        productType: string;
        productUnit: null;
        productVideo: string;
        productWeight: string;
        sellPrice: string;
        sourceFrom: number;
        status: string;
        suggestSellPrice: string;
        supplierId: null;
        supplierName: null;
        variants: NonEmptyArray<CjProductVariant>;
      };
  requestId: string;
};

// Cj Variants
export type CjProductVariant = {
  createTime: string;
  pid: string;
  variantHeight: number;
  variantImage: string;
  variantKey: string;
  variantLength: number;
  variantName: null;
  variantNameEn: string;
  variantProperty: string;
  variantSellPrice: number;
  variantSku: string;
  variantStandard: string;
  variantSugSellPrice: number;
  variantUnit: string;
  variantVolume: number;
  variantWeight: number;
  variantWidth: number;
  vid: string;
};

export type ProductWithTags = Product & {
  tags: ProductTag[];
  variants: ProductVariant[];
  shipments: Shipment[];
};

export type StoreProductIncludeAll = Product & {
  discount: Discount | null;
  tags: ProductTag[];
  sections: ShopSection[];
  variants: ProductVariant[];
};

// CJ Shippings
export type ShippingItem = {
  logisticAging: string;
  logisticPrice: number;
  logisticPriceCn: number;
  logisticName: string;
};

// Cj Response
export type CJResponseListProducts = {
  code: number;
  result: boolean;
  message: string;
  data:
    | undefined
    | {
        pageNum: number;
        pageSize: number;
        total: number;
        list: CjProduct[];
      };
  requestId: string;
};

export type CJShippingResponse = {
  code: number;
  result: boolean;
  message: string;
  data: ShippingItem[];
  requestId: string;
};

export type PrettyShipment = {
  courier: string;
  est: string;
  price: number;
};

export type PrettyVariant = {
  vid: string;
  price: number;
  name: string;
  image: string;
  height: number;
  width: number;
};
