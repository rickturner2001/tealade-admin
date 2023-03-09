import { Card, Spin, Image } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { CjProduct } from "~/types";
import { api } from "~/utils/api";
import Meta from "antd/lib/card/Meta";
import Link from "next/link";

const FindProductCard = ({
  product,
  registeredPids,
}: {
  product: CjProduct;
  registeredPids: string[];
}) => {
  const utils = api.useContext();

  const { mutate: blindProductListing, isLoading: loadingRegistration } =
    api.products.blindProductRegistration.useMutation({
      onSuccess: async () => {
        await utils.products
          .invalidate()
          .catch((error) => console.error(error));
      },
    });

  const { mutate: removeProduct, isLoading: loadingRemoval } =
    api.products.deleteProduct.useMutation({
      onSuccess: async () => {
        await utils.products
          .invalidate()
          .catch((error) => console.error(error));
      },
    });

  return (
    <Card
      actions={[
        loadingRegistration || loadingRemoval ? (
          <Spin />
        ) : registeredPids.includes(product.pid) ? (
          <DeleteOutlined
            color="red"
            key="remove"
            onClick={() => removeProduct({ pid: product.pid })}
          />
        ) : (
          <PlusOutlined
            onClick={() => blindProductListing({ pid: product.pid })}
          />
        ),
      ]}
      className="w-full max-w-md md:max-w-xs"
      cover={<Image alt={product.productNameEn} src={product.productImage} />}
    >
      <Link href={`/product/${product.pid}`}>
        <Meta title={product.productNameEn} className="text-center" />
        <p className="mt-2 text-center text-base font-medium">
          ${product.sellPrice}
        </p>
      </Link>
    </Card>
  );
};

export default FindProductCard;
