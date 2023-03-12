import { Select } from "antd";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const CategoriesDropdown = () => {
  const { data: categories } = api.categories.getAllCategories.useQuery();
  const router = useRouter();

  const { slugs } = router.query;

  const category = slugs
    ? slugs.length > 1
      ? slugs[0]
      : undefined
    : undefined;

  if (categories) {
    return (
      <Select
        className="w-full max-w-lg  "
        defaultValue={
          category
            ? categories.filter((cat) => cat.cid === category)[0]?.label ??
              "Search by category"
            : "Search by category"
        }
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onChange={(e) => router.push(`/find-products/${e}/1`)}
        options={categories.map((category) => {
          return { label: category.label, value: category.cid };
        })}
      />
    );
  }
  return <></>;
};

export default CategoriesDropdown;
