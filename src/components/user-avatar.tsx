"use client";

import { useUserStore } from "@/stores/userStore";
import { Avatar, Button, Dropdown, Space, theme, Typography } from "antd";
import type { MenuProps, DropdownProps } from "antd";
import { useState } from "react";
import { ChevronsUpDown, LogOut, Moon, User } from "lucide-react";
import { AntDesignOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import ThemeSwitcher from "./theme-switcher";
import { useRouter } from "next/navigation";
import { logOutService } from "@/services/auth";

const { Text } = Typography;

export default function UserAvatar() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    token: { colorPrimary, colorTextQuaternary },
  } = theme.useToken();

  const handleLogout = async () => {
    const session = Cookies.get("ava_cms_session");

    if (!session) {
      router.replace("/");
      return;
    }

    try {
      const { jwt } = JSON.parse(session);
      const refreshToken = jwt?.refresh;

      if (!refreshToken) {
        throw new Error("Refresh token not found");
      }

      await logOutService({ refresh: refreshToken })
        .then((response) => {
          if (response.status === 205) {
            // ✅ normal logout from server
            Cookies.remove("ava_cms_session");
            useUserStore.getState().clearUser();
            router.replace("/");
          } else {
            // ✅ fallback: still clear locally
            Cookies.remove("ava_cms_session");
            useUserStore.getState().clearUser();
            router.replace("/");
          }
        })
        .catch((error) => {
          console.error("Failed to logout:", error);

          Cookies.remove("ava_cms_session");
          useUserStore.getState().clearUser();
          router.replace("/");
        });
    } catch (error) {
      console.error("Error during logout:", error);

      Cookies.remove("ava_cms_session");
      useUserStore.getState().clearUser();
      router.replace("/");
    }
  };

  const handleDropDownMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "3" || e.key === "1") {
      setOpen(false);
    }
  };

  const handleOpenChange: DropdownProps["onOpenChange"] = (nextOpen, info) => {
    if (info.source === "trigger" || nextOpen) {
      setOpen(nextOpen);
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Profile",
      icon: <User size={16} />,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Dark mode",
      icon: <Moon size={16} />,
      extra: <ThemeSwitcher />,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: "Logout",
      icon: <LogOut size={16} />,
      onClick: handleLogout,
    },
  ];

  return (
    <div style={{ marginRight: 16 }}>
      <Dropdown
        menu={{ items, onClick: handleDropDownMenuClick }}
        onOpenChange={handleOpenChange}
        open={open}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Button
          icon={<ChevronsUpDown color={colorTextQuaternary} size={16} />}
          iconPosition="end"
          size="large"
          type="text"
        >
          <Space>
            <Avatar
              shape="square"
              style={{ backgroundColor: colorPrimary }}
              icon={<AntDesignOutlined />}
            />
            <Text>{user?.firstName}</Text>
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
}
