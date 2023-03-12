import { useRouter } from "next/router";
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem";
import { SyncOutlined } from "@ant-design/icons";
import {
  Divider,
  Row,
  Skeleton,
  Pagination,
  Space,
  Empty,
  Button,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import AdminDashboardLayout from "~/components/layout/AdminDashboardLayout";
import CategoriesDropdown from "~/components/CategoriesDropdown";
import FindProductCard from "~/components/cards/FindProdctCard";
import PrivateRoute from "~/components/layout/PrivateRoute";
import { signOut } from "next-auth/react";

const ListingWrapper = ({
  pageNumber,
  category,
}: {
  children?: JSX.Element;
  title: string;
  pageNumber: number;
  category?: string;
}) => {
  const pageData = useState(40);

  const { data: registeredProducts, error } =
    api.products.getAllImportedProducts.useQuery();

  const { data: products } = api.cjApi.getListProducts.useQuery({
    pageNum: (pageNumber ? (+pageNumber as number | undefined) : 1) ?? 1,
    perPage: pageData[0],
    categoryKeyword: category ?? null,
  });

  const router = useRouter();

  useEffect(() => {
    if (error?.message === "UNAUTHORIZED") {
      (async () => await signOut())().catch((error) => console.error(error));
    }
  }, [error]);

  return (
    <AdminDashboardLayout
      breadCrumbs={[<BreadcrumbItem key={1}>Imported Products</BreadcrumbItem>]}
    >
      <>
        <Divider />
        <div className="flex w-full justify-center">
          <CategoriesDropdown />
        </div>

        <Divider />

        {!products || !products.data || !registeredProducts ? (
          <div className="mt-12 flex flex-col items-center justify-center">
            <Spin />
          </div>
        ) : !products.result ? (
          <div className="mt-12 flex flex-col items-center justify-center">
            <Empty />
            <Button
              icon={<SyncOutlined />}
              type="primary"
              className="bg-blue-500"
            >
              Refresh
            </Button>
          </div>
        ) : (
          <Row className="gap-8">
            {products.data.list.map((product) => {
              return (
                <FindProductCard
                  product={product}
                  key={product.pid}
                  registeredPids={registeredProducts.map((prod) => prod.pid)}
                />
              );
            })}
          </Row>
        )}
        <Space className="w-full justify-center py-12" align="center">
          {products && (
            <Pagination
              pageSize={40}
              defaultCurrent={pageNumber}
              total={999}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onChange={(e) =>
                router.push(
                  `${
                    category
                      ? `/find-products/${category}/${e}/`
                      : `/find-products/${e}/`
                  }`
                )
              }
            />
          )}
        </Space>
      </>
    </AdminDashboardLayout>
  );
};

const ListByPageNumber = () => {
  const router = useRouter();

  const { slugs } = router.query;

  return (
    <PrivateRoute>
      <ListingWrapper
        title="Find products"
        pageNumber={
          slugs ? (slugs[1] ? +slugs[1] : slugs[0] ? +slugs[0] : 1) : 1
        }
        category={slugs && slugs.length > 1 ? slugs[0] : undefined}
      />
    </PrivateRoute>
  );
};

export default ListByPageNumber;
