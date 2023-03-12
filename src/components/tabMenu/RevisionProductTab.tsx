import { Space, Image, Typography } from "antd";
import { useContext } from "react";
import { ImportedProductsContext } from "~/context/importedProductsContext";

const { Title, Text } = Typography;

const RevisionProductTab = () => {
  const { defaultThumbnail, productDescription } = useContext(
    ImportedProductsContext
  );
  return (
    <div className="flex w-full flex-col p-4 lg:flex-row">
      <Image
        className="w-full max-w-xs"
        src={defaultThumbnail}
        alt={productDescription}
      />

      <Title />
    </div>
  );
};

export default RevisionProductTab;
