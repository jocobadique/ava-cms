"use client";

import { Layout, Spin, theme } from "antd";

export default function Loading() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colorBgContainer,
      }}
    >
      <Spin />
    </Layout>
  );
}
