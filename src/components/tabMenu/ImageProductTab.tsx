import { Row } from "antd";
import { useContext, useState } from "react";
import { ImportedProductsContext } from "~/context/importedProductsContext";

const ImagesProductTab = () => {
  const { product } = useContext(ImportedProductsContext);

  return (
    <Row className="gap-4">
      {product.imageSet.map((img) => {
        return <ImageRender key={img} img={img} />;
      })}
    </Row>
  );
};

const ImageRender = ({ img }: { img: string }) => {
  const { imagesSet, setImagesSet } = useContext(ImportedProductsContext);

  const handleClick = () => {
    if (imagesSet.includes(img)) {
      setImagesSet((prev) => prev.filter((src) => src !== img));
    } else {
      setImagesSet((prev) => [...prev, img]);
    }
  };

  return (
    <img
      key={img}
      src={img}
      onClick={handleClick}
      className={`h-48 w-48 cursor-pointer object-cover ring-2 ${
        imagesSet.includes(img) ? "  ring-blue-500" : "ring-transparent"
      }`}
    />
  );
};
export default ImagesProductTab;
