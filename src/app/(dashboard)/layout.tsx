"use client";

import { AntDesignOutlined } from "@ant-design/icons";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button, Drawer, Flex, Grid, Layout, theme, Typography } from "antd";
import { usePageAuth } from "@/utilities/pageAuth";
import Loading from "@/components/app-loading";
import UserAvatar from "@/components/user-avatar";
import Menus from "@/components/menu";
import MobileMenus from "@/components/mobile-menu";
import { useSidebarStore } from "@/stores/sidebarStore";

const { Title } = Typography;
const { Header, Sider } = Layout;
const { useBreakpoint } = Grid;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isChecking = usePageAuth(true);
  const screens = useBreakpoint();
  const { isCollapsed, toggleCollapse, setCollapse } = useSidebarStore();
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();
  const isMobile = !screens.lg;

  if (isChecking) {
    return <Loading />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Menu */}
      {!isMobile && (
        <Sider
          theme="light"
          trigger={null}
          collapsible
          collapsed={isCollapsed}
          width={200}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            transition: "width 0.3s ease",
          }}
        >
          <Flex
            style={{ margin: 16 }}
            gap="middle"
            justify="center"
            align="center"
          >
            <AntDesignOutlined style={{ fontSize: 32, color: colorPrimary }} />
            {!isCollapsed && (
              <Title
                style={{
                  marginBottom: 0,
                  transition: "opacity 0.4s",
                  whiteSpace: "nowrap",
                }}
                level={4}
              >
                AVA
              </Title>
            )}
          </Flex>
          <Menus />
        </Sider>
      )}

      {/* Mobile Menu Drawer */}
      {isMobile && (
        <Drawer
          open={isCollapsed}
          onClose={() => setCollapse(false)}
          placement="left"
          mask={false}
        >
          <Flex style={{ margin: 16 }} gap="middle">
            <AntDesignOutlined style={{ fontSize: 32, color: colorPrimary }} />
            <Title
              style={{
                marginBottom: 0,
                whiteSpace: "nowrap",
              }}
              level={4}
            >
              AVA
            </Title>
          </Flex>
          <MobileMenus />
        </Drawer>
      )}

      <Layout
        style={{
          marginLeft: !isMobile && isCollapsed ? 80 : !isMobile ? 200 : 0,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: "fixed",
            top: 0,
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: !isMobile
              ? `calc(100% - ${isCollapsed ? 80 : 200}px)`
              : "100%",
            transition: "width 0.3s ease",
          }}
        >
          <Button
            type="text"
            icon={
              isCollapsed ? (
                <PanelLeftClose size={20} />
              ) : (
                <PanelLeftOpen size={20} />
              )
            }
            onClick={toggleCollapse}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <UserAvatar />
        </Header>
        {children}
      </Layout>
    </Layout>
  );
}
