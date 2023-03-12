import { Button, Divider, Input, InputRef } from "antd";
import { useContext, useRef } from "react";
import { ImportedProductsContext } from "~/context/importedProductsContext";
import { api } from "~/utils/api";

const TagsContainer = () => {
  const { product } = useContext(ImportedProductsContext);

  const utils = api.useContext();

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
    <div>
      <div className="flex gap-2">
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
              onClick={() => removeTag({ label: tag.label, pid: product.pid })}
              key={tag.label}
            >
              {tag.label}
            </Button>
          );
        })}
      </div>
      <Divider />
    </div>
  );
};

export default TagsContainer;
