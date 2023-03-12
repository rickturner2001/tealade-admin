import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem";
import {
  Alert,
  Button,
  Carousel,
  Divider,
  Empty,
  Image,
  Spin,
  Card,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import type {
  CJProductSpecifics,
  ProductWithShipmentAndVariants,
} from "~/types";
import AdminDashboardLayout from "~/components/layout/AdminDashboardLayout";
import { Meta } from "antd/lib/list/Item";
import { evaluatePriceRange } from "~/functions";
import ShipmentSelection from "~/components/product/ShipmentsSelection";
import type { Shipment } from "@prisma/client";

const { Text, Title, Link } = Typography;

const ProductSpecifics = ({ pid }: { pid: string }) => {
  const { data: productData } = api.products.findOrRequestId.useQuery({ pid });

  const utils = api.useContext();

  const [shipments, setShipments] = useState<Shipment[]>([]);

  const {
    mutate: registerProduct,
    isLoading,
    isError,
    isSuccess,
  } = api.products.registerProduct.useMutation({
    onSuccess: async () => {
      await utils.products.invalidate();
    },
  });

  const {
    mutate: updateProductShipment,
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    isSuccess: isSuccessUpdate,
  } = api.products.updateProductShipments.useMutation({
    onSuccess: async () => {
      await utils.products.invalidate();
    },
  });

  if (!productData || ("data" in productData && !productData.data)) {
    return <Spin className="mt-12" />;
  }
  const product:
    | CJProductSpecifics
    | ProductWithShipmentAndVariants
    | undefined = "data" in productData ? productData.data : productData;

  if (!product) {
    return <Empty className="mt-12" />;
  }
  return (
    <>
      {isError ||
        (isErrorUpdate && (
          <Alert
            message="Error! only admins can register products"
            closable
            type="error"
          />
        ))}
      <div className="mx-auto mt-12 flex w-full flex-col gap-8 md:max-w-7xl lg:flex-row">
        <Carousel autoplay className="mx-auto w-full max-w-md">
          {"productImageSet" in product
            ? product.productImageSet.map((src) => {
                return (
                  <Image
                    src={src}
                    alt=""
                    key={src}
                    className="w-full max-w-md object-cover"
                  />
                );
              })
            : product.imageSet.map((src) => {
                return (
                  <Image
                    src={src}
                    alt=""
                    key={src}
                    className="w-full max-w-md object-cover"
                  />
                );
              })}
        </Carousel>
        <div className="w-full bg-white p-4 ">
          <Title className="">
            {"entryNameEn" in product ? product.entryNameEn : product.name}
          </Title>
          <br />
          <Link
            target="_blank"
            className="block pb-4"
            href={`https://www.cjdropshipping.com/product/-p-${pid}.html?from=HTP`}
          >
            CJ Dropshipping
          </Link>
          <Text>
            {"productNameEn" in product
              ? product.productNameEn
              : product.description}
          </Text>

          <Title level={5}>
            $
            {"sellPrice" in product
              ? product.sellPrice
              : evaluatePriceRange(
                  product.variants.map((variant) => variant.price)
                )}
          </Title>

          <Divider />
          <ShipmentSelection
            setShipments={setShipments}
            shipments={shipments}
            vid={product.variants[0].vid}
            productShipments={
              "shipments" in product ? product.shipments : undefined
            }
          />
          <Divider />

          <Button
            loading={isLoading || isLoadingUpdate}
            onClick={() => {
              if ("productImageSet" in product) {
                console.log(product.categoryName);

                console.log(product.categoryId);
                registerProduct({
                  categoryId: product.categoryId,
                  defaultThumbnail: product.productImageSet[0],
                  sectionId: null,
                  description: product.productNameEn,
                  name: product.entryNameEn,
                  imageSet: product.productImageSet,
                  categoryLabel: product.categoryName,
                  pid: product.pid,
                  shipments: shipments,
                  isImport: true,
                  isStore: false,
                  variants: product.variants.map((variant) => {
                    return {
                      height: variant.variantHeight,
                      image: variant.variantImage,
                      name: variant.variantNameEn,
                      price: variant.variantSellPrice,
                      vid: variant.vid,
                      width: variant.variantWidth,
                    };
                  }),
                });
              } else {
                if (shipments.length === 2)
                  updateProductShipment({
                    pid: product.pid,
                    shipments: shipments,
                  });
              }
            }}
            block
            type="primary"
            className={
              isSuccess || isSuccessUpdate ? "bg-green-600" : " bg-blue-500"
            }
          >
            {isSuccess || isSuccessUpdate
              ? "Success"
              : "productImageSet" in product
              ? "Add to imports list"
              : "Update shipments"}
          </Button>
        </div>
      </div>
      <div className="my-12 bg-white p-6 ">
        <div className="flex flex-wrap gap-6">
          {product.variants.map((variant) => {
            return (
              <Card
                key={variant.vid}
                className="w-full max-w-md md:max-w-xs"
                cover={
                  <Image
                    alt={
                      "variantNameEn" in variant
                        ? variant.variantNameEn
                        : variant.variantName
                    }
                    src={
                      "variantImage" in variant
                        ? variant.variantImage
                        : variant.thumbnail
                    }
                  />
                }
              >
                <Meta
                  title={
                    "variantNameEn" in variant
                      ? variant.variantNameEn
                      : variant.variantName
                  }
                  className="text-center"
                />
                <p className="mt-2 text-center text-base font-medium">
                  $
                  {"variantSellPrice" in variant
                    ? variant.variantSellPrice
                    : variant.price}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};

const ProductSpecificsWrapper = () => {
  const router = useRouter();

  const { pid } = router.query;
  return (
    <AdminDashboardLayout
      breadCrumbs={[
        <BreadcrumbItem key={1}>Product information</BreadcrumbItem>,
      ]}
    >
      {!pid ? <Empty /> : <ProductSpecifics pid={pid as string} />}
    </AdminDashboardLayout>
  );
};

export default ProductSpecificsWrapper;
