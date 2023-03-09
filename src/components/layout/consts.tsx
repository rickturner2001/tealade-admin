import {
  ArchiveBoxArrowDownIcon,
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { Button, type MenuProps } from "antd";
import { signOut } from "next-auth/react";
import Link from "next/link";

export const menuItems: MenuProps["items"] = [
  {
    key: "1",
    label: "Find products",
    icon: (
      <Link href={"/find-products/1"}>
        <MagnifyingGlassIcon className="strke-2 h-4 w-4" />
      </Link>
    ),
  },
  {
    key: "2",
    label: "Import list",
    icon: (
      <Link href={"/import-list"}>
        <ArchiveBoxArrowDownIcon className="h-4 w-4 stroke-2" />
      </Link>
    ),
  },
  {
    key: "3",
    label: "Imported products",
    icon: (
      <Link href={"/"}>
        <BuildingStorefrontIcon className="h-4 w-4 stroke-2" />
      </Link>
    ),
  },
  {
    key: "4",
    label: "Section builder",
    icon: <WrenchScrewdriverIcon className="h-4 w-4 stroke-2" />,
  },
];

export const dropdownItems: MenuProps["items"] = [
  {
    label: (
      <Button
        type="primary"
        onClick={() => void (async () => await signOut())()}
        className="bg-blue-500"
      >
        Sign out
      </Button>
    ),
    key: "sign out",
  },
];
