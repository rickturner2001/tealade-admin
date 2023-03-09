import {
  Button,
  Divider,
  Form,
  Image,
  Input,
  type InputRef,
  Select,
  Spin,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useContext, useRef } from "react";
import { api } from "~/utils/api";
import { ImportedProductsContext } from "~/context/importedProductsContext";
const GeneralProductTab = () => {
  const { data: sections } = api.sections.getAllSections.useQuery();
  const {
    product,
    setProductName,
    margin,
    productName,
    setProductDescription,
    productSection,
    setSection,
    productDescription,
    imagesSet,
    variants,
  } = useContext(ImportedProductsContext);
  const utils = api.useContext();
  const { mutate: registerProduct, isLoading: loadingRegistration } =
    api.products.registerProduct.useMutation({
      onSuccess: async () => {
        await utils.products.getAllImportedProducts.invalidate();
      },
    });
  const { mutate: removeProduct, isLoading: loadingRemoval } =
    api.products.deleteProduct.useMutation({
      onSuccess: async () => {
        await utils.products.getAllImportedProducts.invalidate();
      },
    });
  const { mutate: addNewTag, isLoading: loadingTag } =
    api.products.createProductTag.useMutation({
      onSuccess: async () => {
        await utils.products.getAllImportedProducts.invalidate();
      },
    });
  const { mutate: removeTag, isLoading: loadingRemoveTag } =
    api.products.deleteProductTag.useMutation({
      onSuccess: async () => {
        await utils.products.getAllImportedProducts.invalidate();
      },
    });
  const labelRef = useRef<InputRef>(null);
  return (
    <div className="flex w-full flex-col items-center gap-4 md:flex-row">
      {" "}
      <Image
        className="w-full max-w-xs"
        src={product.defaultThumbnail}
        alt={product.name}
      />{" "}
      <Form name="form_product" layout="vertical" className="w-full">
        {" "}
        <div className="flex w-full flex-col gap-3 lg:flex-row">
          {" "}
          <Form.Item
            label="Product name"
            name={"Product name"}
            className="w-full"
          >
            {" "}
            <Input
              defaultValue={product.name}
              onChange={(e) => setProductName(e.target.value)}
            />{" "}
          </Form.Item>{" "}
          <Form.Item label="Item description" className="w-full">
            {" "}
            <TextArea
              onChange={(e) => setProductDescription(e.target.value)}
              defaultValue={product.description}
              className="w-full max-w-md"
            />{" "}
          </Form.Item>{" "}
        </div>{" "}
        <Divider />{" "}
        <Form.Item label="Tags" name={"Tags"}>
          {" "}
          <div className="flex gap-2">
            {" "}
            <Input
              placeholder="Trendy"
              ref={labelRef}
              className=""
              onKeyDown={(e) => {
                if (e.key === "Enter" && labelRef?.current?.input?.value) {
                  addNewTag({
                    label: labelRef.current.input.value,
                    pid: product.pid,
                  });
                  labelRef.current.input.value = "";
                }
              }}
            />{" "}
            <Button
              onClick={() => {
                if (labelRef?.current?.input?.value) {
                  addNewTag({
                    label: labelRef.current.input.value,
                    pid: product.pid,
                  });
                  labelRef.current.input.value = "";
                }
              }}
              loading={loadingTag}
              className="bg-blue-500"
              type="primary"
            >
              Add Tag
            </Button>
          </div>
          <div className="mt-4 flex w-full flex-wrap items-center">
            {product.tags.map((tag) => {
              return (
                <Button
                  size="small"
                  loading={loadingRemoveTag}
                  onClick={() =>
                    removeTag({ label: tag.label, pid: product.pid })
                  }
                  key={tag.label}
                >
                  {tag.label}
                </Button>
              );
            })}
          </div>
          <Divider />
        </Form.Item>
        <Form.Item label="Section">
          {sections ? (
            <Select
              defaultValue={productSection ?? "Select a section"}
              onChange={(e) => setSection(e)}
              options={sections.map((section) => {
                return { label: section.label, value: section.id };
              })}
            />
          ) : (
            <Spin />
          )}
        </Form.Item>
        <div className="flex flex-col justify-end gap-2 md:flex-row">
          <Button
            danger
            type="primary"
            className="w-full md:w-max"
            loading={loadingRemoval}
            onClick={() => removeProduct({ pid: product.pid })}
          >
            Remove product
          </Button>
          <Button
            loading={loadingRegistration}
            type="primary"
            className=" w-full bg-blue-500 md:w-max"
            onClick={() => {
              registerProduct({
                isImport: false,
                isStore: true,
                description: productDescription,
                imageSet: imagesSet,
                name: productName,
                defaultThumbnail: product.defaultThumbnail,
                categoryId: product.categoryId,
                shipments: product.shipments.map((ship) => {
                  return {
                    courier: ship.courier,
                    est: ship.est,
                    price: ship.cost,
                  };
                }),
                pid: product.pid,
                sectionId: productSection,
                variants: variants.map((variant) => {
                  return {
                    height: variant.height,
                    image: variant.image,
                    name: variant.name,
                    price: variant.price + variant.price * (margin / 100),
                    vid: variant.vid,
                    width: variant.width,
                  };
                }),
              });
            }}
          >
            Add to imports
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default GeneralProductTab;
