"use client";

import { Layout, Spin, theme } from "antd";

const { Content } = Layout;

export default function Loading() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Content
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "88px 16px 24px 16px",
        padding: 24,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Spin />
    </Content>
  );
}
