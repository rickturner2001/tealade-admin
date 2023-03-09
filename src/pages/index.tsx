import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem";
import { Alert, Button, Divider, Empty, Row, Spin } from "antd";
import { api } from "~/utils/api";
import AdminDashboardLayout from "~/components/layout/AdminDashboardLayout";
import ListedProductCard from "~/components/cards/ListedProductCard";
import { useEffect, useState } from "react";
import PrivateRoute from "~/components/layout/PrivateRoute";
import { signOut } from "next-auth/react";

const ImportedProducts = () => {
  const { data: registeredProducts, error } =
    api.products.getAllStoreProducts.useQuery();

  useEffect(() => {
    if (error?.message === "UNAUTHORIZED") {
      (async () => await signOut())().catch((error) => console.error(error));
    }
  }, [error]);

  const [isError, setIsError] = useState(false);
  return (
    <PrivateRoute>
      <AdminDashboardLayout
        breadCrumbs={[
          <BreadcrumbItem key={1}>Imported Products</BreadcrumbItem>,
        ]}
      >
        <>
          <Divider />

          {isError && (
            <Alert
              message="Error! Only admins can interact with products"
              onClose={() => setIsError(false)}
              type="error"
              closable
              className="my-12"
            />
          )}
          {!registeredProducts ? (
            <div className="mt-12 flex items-center justify-center">
              <Spin />
            </div>
          ) : !registeredProducts.length ? (
            <div className="mt-12 flex flex-col items-center justify-center">
              <Empty />
              <Button type="primary" className="bg-blue-500">
                Add products
              </Button>
            </div>
          ) : (
            <Row className="gap-8">
              {registeredProducts.map((prod) => {
                return (
                  <ListedProductCard
                    key={prod.pid}
                    setIsError={setIsError}
                    product={prod}
                  />
                );
              })}
            </Row>
          )}
        </>
      </AdminDashboardLayout>
    </PrivateRoute>
  );
};

export default ImportedProducts;
