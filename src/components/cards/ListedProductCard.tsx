import { Badge, Card, Space, Spin, Tag, Image } from "antd";
import Meta from "antd/lib/card/Meta";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import { evaluatePriceRange, getProductDiscount } from "~/functions";
import type { StoreProductIncludeAll } from "~/types";
import { api } from "~/utils/api";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ListedProductCard = ({
  setIsError,
  product,
}: {
  setIsError: Dispatch<SetStateAction<boolean>>;
  product: StoreProductIncludeAll;
}) => {
  const utils = api.useContext();

  const {
    mutate: moveProducstToEdits,
    isLoading: loadingProductEdit,
    isError: editsError,
  } = api.products.updateProductRemoveFromStore.useMutation({
    onSuccess: async () => {
      await utils.products.invalidate();
    },
  });

  const {
    mutate: removeProduct,
    isLoading: loadingRemoval,
    isError,
  } = api.products.deleteProduct.useMutation({
    onSuccess: async () => {
      await utils.products.invalidate().catch((error) => console.error(error));
    },
  });

  useEffect(() => {
    if (isError || editsError) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [isError, editsError, setIsError]);

  const priceRange = evaluatePriceRange(
    product.variants.map((variant) => variant.price)
  );
  const discount = product.discount?.value;
  const price = discount
    ? getProductDiscount(priceRange, discount)
    : priceRange;

  return (
    <Card
      actions={[
        loadingProductEdit ? (
          <Spin />
        ) : (
          <EditOutlined
            onClick={() => moveProducstToEdits({ pid: product.pid })}
            key="edit"
          />
        ),
        loadingRemoval ? (
          <Spin />
        ) : (
          <DeleteOutlined
            onClick={() => removeProduct({ pid: product.pid })}
            key="remove"
          />
        ),
      ]}
      className="w-full max-w-md md:max-w-xs"
      cover={
        discount ? (
          <Badge count={discount.toString() + " %"}>
            <Image alt={product.name} src={product.defaultThumbnail} />
          </Badge>
        ) : (
          <Image alt={product.name} src={product.defaultThumbnail} />
        )
      }
    >
      <Space className="w-full justify-center pb-4" align="center" wrap>
        {product.sections.map((section) => {
          return (
            <Tag color="blue" key={section.id}>
              {section.label}
            </Tag>
          );
        })}
      </Space>

      <Meta title={product.name} className="text-center" />
      <p className="mt-2 text-center text-base font-medium">${price}</p>
    </Card>
  );
};

export default ListedProductCard;
