import type { Shipment } from "@prisma/client";
import { Spin, type SelectProps, Select } from "antd";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import { ShippingItem } from "~/types";
import { api } from "~/utils/api";

const ShipmentSelection = ({
  vid,
  setShipments,
  shipments,
  productShipments,
}: {
  vid: string;
  setShipments: Dispatch<SetStateAction<Shipment[]>>;
  shipments: Shipment[];
  productShipments?: Shipment[];
}) => {
  const { data: shipmentData } = api.cjApi.requestShipmentByVid.useQuery({
    vid,
  });

  useEffect(() => {
    if (productShipments) {
      setShipments(productShipments);
    }
  }, [productShipments, setShipments]);
  if (!shipmentData || !shipmentData?.data) {
    return <Spin />;
  }

  const shipmentsData = shipmentData.data;

  const options: SelectProps["options"] = [];

  shipmentsData.map((shipment, idx) => {
    options.push({
      label: `$${shipment.logisticPrice} (${shipment.logisticAging} days)`,
      value: idx.toString(),
    });
  });

  const getShipmentByStringId = (id: string) => {
    const shipment = shipmentsData[+id] as ShippingItem;

    return {
      cost: shipment.logisticPrice,
      courier: shipment.logisticName,
      est: shipment.logisticAging,
    } as Shipment;
  };

  const handler = (values: string[]) => {
    // Shipment has been deleted
    if (shipments.length > values.length) {
      if (!values.length) {
        setShipments([]);
        return;
      }
      values.map((idx) => {
        const shipment = getShipmentByStringId(idx);
        setShipments((prev) =>
          prev.filter((ship) => ship.cost == shipment.cost)
        );
      });
    } else {
      values.map((val) => {
        const shipping = getShipmentByStringId(val);
        if (!shipments.map((ship) => ship.cost).includes(shipping.cost))
          setShipments((prev) => [...prev, shipping]);
      });
    }
  };

  console.log(shipments);
  return (
    <Select
      mode="multiple"
      allowClear
      style={{ width: "100%" }}
      placeholder="Please select"
      defaultValue={
        productShipments
          ? (shipmentsData
              .map((ship) => {
                const currentPrices = productShipments.map(
                  (shipment) => shipment.cost
                );
                if (currentPrices.indexOf(ship.logisticPrice) !== -1) {
                  return currentPrices.indexOf(ship.logisticPrice).toString();
                }
                return null;
              })
              .filter((ship) => ship !== null) as string[])
          : undefined
      }
      onChange={handler}
      options={options}
    />
  );
};

export default ShipmentSelection;
