/* eslint-disable @typescript-eslint/no-empty-function */
import { Spin, Tabs } from "antd";
import { useState } from "react";
import { ImportedProductsContext } from "~/context/importedProductsContext";
import type { PrettyShipment, PrettyVariant, ProductWithTags } from "~/types";
import GeneralProductTab from "./GeneralProductTab";
import VariantsProductTab from "./VariantsProductTab";
import ImagesProductTab from "./ImageProductTab";
import Link from "next/link";
import RevisionProductTab from "./RevisionProductTab";
import { Shipment } from "@prisma/client";

const TabMenu = ({ product }: { product: ProductWithTags }) => {
  const [productName, setProductName] = useState(product.name);
  const [productDescription, setProductDescription] = useState(
    product.description
  );
  const [defaultThumbnail, setDefaultThumbnail] = useState(
    product.defaultThumbnail
  );
  const [imagesSet, setImagesSet] = useState(product.imageSet);
  const [variants, setVariants] = useState<PrettyVariant[]>(
    product.variants.map((variant) => {
      return {
        height: variant.height,
        image: variant.thumbnail,
        name: variant.variantName,
        price: variant.price,
        vid: variant.vid,
        width: variant.width,
      };
    })
  );

  const [margin, setMargin] = useState(0);

  const [productSection, setProductSection] = useState("");
  const [shipments, setShipments] = useState<Shipment[]>(
    product.shipments.map((ship) => {
      return {
        courier: ship.courier,
        est: ship.est,
        cost: ship.cost,
      } as Shipment;
    })
  );
  return (
    <ImportedProductsContext.Provider
      value={{
        defaultThumbnail: defaultThumbnail,
        setDefaultThumbnail: setDefaultThumbnail,
        imagesSet: imagesSet,
        setImagesSet: setImagesSet,
        product: product,
        productDescription: productDescription,
        productName: productName,
        productSection: productSection,
        setProductDescription: setProductDescription,
        section: productSection,
        setSection: setProductSection,
        setMargin: setMargin,
        setProductName: setProductName,
        setShipments: setShipments,
        setVariants: setVariants,
        shipments: shipments,
        margin: margin,
        variants: variants,
      }}
    >
      <Tabs
        className="w-full bg-white p-4"
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "information",
            children: <GeneralProductTab />,
          },
          {
            key: "2",
            label: "Variants",
            children: <VariantsProductTab />,
          },
          { key: "3", label: "Images", children: <ImagesProductTab /> },
          {
            key: "4",
            label: <Link href={`/product/${product.pid}`}>Shipping</Link>,
            children: (
              <div className="flex h-full w-full  flex-col items-center justify-center">
                <Spin />
              </div>
            ),
          },
        ]}
      />
    </ImportedProductsContext.Provider>
  );
};

export default TabMenu;
