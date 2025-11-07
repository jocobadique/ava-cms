"use client";

import Loading from "@/components/app-loading";
import LoginForm from "@/components/login-form";
import { usePageAuth } from "@/utilities/pageAuth";
import { Layout } from "antd";

export default function Home() {
  const isChecking = usePageAuth(false);

  if (isChecking) {
    return <Loading />;
  }

  return (
    <Layout
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoginForm />
    </Layout>
  );
}
