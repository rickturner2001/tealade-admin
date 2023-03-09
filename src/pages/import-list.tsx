import { Divider, Col, Skeleton, Spin, Empty, Button } from "antd";
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem";
import AdminDashboardLayout from "~/components/layout/AdminDashboardLayout";
import TabMenu from "~/components/tabMenu/TabMenu";
import { api } from "~/utils/api";
const ImportList = () => {
  const { data: products } = api.products.getAllImportedProducts.useQuery();

  return (
    <AdminDashboardLayout
      breadCrumbs={[<BreadcrumbItem key={1}>Imported Products</BreadcrumbItem>]}
    >
      <>
        <Divider />

        {!products ? (
          <div className="mt-12 flex flex-col items-center justify-center">
            <Spin />
          </div>
        ) : !products.length ? (
          <div className="flex flex-col items-center justify-center">
            <Empty />
            <Button className="bg-blue-500" href="/find-products/1">
              Add products
            </Button>
          </div>
        ) : (
          <Col className="mx-auto max-w-7xl gap-8 space-y-8">
            {products.map((prod) => {
              return <TabMenu key={prod.pid} product={prod} />;
            })}
          </Col>
        )}
      </>
    </AdminDashboardLayout>
  );
};

export default ImportList;
