import { env } from "./env.mjs";
import type {
  CJResponseListProducts,
  CJShippingResponse,
  CjResponseProductSpecifics,
} from "./types.js";

export const requestProductList = async (
  perPage: number,
  pageNum: number,
  categoryKeyword: string | null = null
) => {
  const response = await fetch(
    `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=${pageNum}&pageSize=${perPage}${
      categoryKeyword ? `&categoryId=${categoryKeyword}` : ""
    }`,
    {
      headers: {
        "Content-Type": "application/json",
        "CJ-Access-Token": env.CJ_TOKEN,
      },
    }
  );

  const cjJsonresponse = (await response.json()) as CJResponseListProducts;

  return cjJsonresponse;
};

export const requestProductById = async (
  pid: string
): Promise<CjResponseProductSpecifics> => {
  const response = await fetch(
    `https://developers.cjdropshipping.com/api2.0/v1/product/query?pid=${pid}`,
    {
      headers: {
        "CJ-Access-Token": env.CJ_TOKEN,
      },
    }
  );

  const cjJsonresponse = (await response.json()) as CjResponseProductSpecifics;
  return cjJsonresponse;
};

export const requestShipmentByVid = async (vid: string) => {
  const response = await fetch(
    "https://developers.cjdropshipping.com/api2.0/v1/logistic/freightCalculate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CJ-Access-Token": env.CJ_TOKEN,
      },
      body: JSON.stringify({
        startCountryCode: "CN",
        endCountryCode: "IT",
        products: [
          {
            quantity: 1,
            vid: vid,
          },
        ],
      }),
    }
  );

  const jsonResponse = (await response.json()) as CJShippingResponse;
  return jsonResponse;
};

// Product functions
export const evaluatePriceRange = (variants: number[]) => {
  if (variants.length === 1) {
    return Math.ceil(variants[0] as number);
  }
  const first = Math.ceil(variants[0] as number);
  const last = Math.ceil(variants[variants.length - 1] as number);

  if (first === last) {
    return first;
  }
  return `${first}-${last}`;
};

export const getProductDiscount = (
  price: string | number,
  discount: number
) => {
  if (typeof price === "number") {
    return Math.ceil((price * (100 - discount)) / 100);
  } else {
    const [startPrice, endPrice] = price.split("-");
    const discountedStartPrice = Math.ceil(
      (parseInt(startPrice as string) * (100 - discount)) / 100
    );
    const discountedEndPrice = Math.ceil(
      (parseInt(endPrice as string) * (100 - discount)) / 100
    );
    if (discountedEndPrice === discountedStartPrice) {
      return discountedStartPrice;
    }
    return `${discountedStartPrice}-${discountedEndPrice}`;
  }
};
