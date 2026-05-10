"use client";

import { useSidebarStore } from "@/stores/sidebarStore";
import { Menu } from "antd";
import {
  CreditCard,
  HeartPulse,
  Hospital,
  LayoutDashboard,
  LayoutGrid,
  PillBottle,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function MobileMenus() {
  const router = useRouter();
  const pathname = usePathname();
  const { setCollapse } = useSidebarStore();

  // Map current pathname to selected menu key
  const getSelectedKeys = () => {
    if (pathname.startsWith("/dashboard")) return ["1"];
    if (pathname.startsWith("/user/cms-admins")) return ["2-1"];
    if (pathname.startsWith("/user/subscribers")) return ["2-2"];
    if (pathname.startsWith("/user/practitioners")) return ["2-3"];
    if (pathname.startsWith("/clinics")) return ["3"];
    if (pathname.startsWith("/mco")) return ["4"];
    if (pathname.startsWith("/bill-exemption")) return ["5"];
    if (pathname.startsWith("/drugs")) return ["6"];
    if (pathname.startsWith("/business-intelligence/general")) return ["7-1"];
    if (pathname.startsWith("/business-intelligence/basic-stats"))
      return ["7-2"];
    // if (pathname.startsWith("/business-intelligence/other")) return ["7-3"];
    return [];
  };

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case "1":
        router.push("/dashboard");
        break;
      case "2-1":
        router.push("/user/cms-admins");
        break;
      case "2-2":
        router.push("/user/subscribers");
        break;
      case "2-3":
        router.push("/user/practitioners");
        break;
      case "3":
        router.push("/clinics");
        break;
      case "4":
        router.push("/mco");
        break;
      case "5":
        router.push("/bill-exemption");
        break;
      case "6":
        router.push("/drugs");
        break;
      case "7-1":
        router.push("/business-intelligence/general");
        break;
      case "7-2":
        router.push("/business-intelligence/basic-stats");
        break;
      // case "7-3":
      //   router.push("/business-intelligence/other");
      //   break;
      default:
        break;
    }
    setCollapse(false);
  };
  return (
    <Menu
      mode="inline"
      selectedKeys={getSelectedKeys()}
      onClick={handleMenuClick}
      items={[
        {
          key: "1",
          icon: <LayoutDashboard size={20} />,
          label: "Dashboard",
        },
        {
          key: "2",
          icon: <Users size={20} />,
          label: "Users",
          children: [
            {
              key: "2-1",
              label: "CMS Admins",
            },
            {
              key: "2-2",
              label: "Subscribers",
            },
            {
              key: "2-3",
              label: "Practitioners",
            },
          ],
        },
        {
          key: "3",
          icon: <Hospital size={20} />,
          label: "Clinics",
        },
        {
          key: "4",
          icon: <HeartPulse size={20} />,
          label: "MCO",
        },
        {
          key: "5",
          icon: <CreditCard size={20} />,
          label: "Bill Exemption",
        },
        {
          key: "6",
          icon: <PillBottle size={20} />,
          label: "Drugs",
        },
        {
          key: "7",
          icon: <LayoutGrid size={20} />,
          label: "Business Intelligence",
          children: [
            {
              key: "7-1",
              label: "General",
            },
            {
              key: "7-2",
              label: "Basic Stats",
            },
            // {
            //   key: "7-3",
            //   label: "Other",
            // },
          ],
        },
      ]}
    />
  );
}
