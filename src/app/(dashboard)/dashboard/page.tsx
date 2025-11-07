"use client";

import { Breadcrumb, Flex, Layout, theme, Typography } from "antd";
import { CalendarFilled } from "@ant-design/icons";
import Link from "next/link";

const { Content } = Layout;
const { Text } = Typography;

export default function DashboardPage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <Flex
        wrap
        gap="small"
        style={{ margin: "88px 16px 0px 16px" }}
        align="center"
        justify="space-between"
      >
        <Breadcrumb
          items={[
            {
              title: <Link href={"/dashboard"}>Dashboard</Link>,
            },
          ]}
        />
        <Text type="secondary">
          <CalendarFilled style={{ marginRight: 6 }} />
          {new Date().toLocaleString("en-US", {
            timeZone: "UTC",
            dateStyle: "full",
          })}
        </Text>
      </Flex>
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <h1>Dashboard</h1>
      </Content>
    </>
  );
}
