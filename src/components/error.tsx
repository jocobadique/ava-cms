"use client";

import { Button, Layout, Result, theme } from "antd";
import { useRouter } from "next/navigation";

const { Content } = Layout;

// Ant Design's accepted status types
type ResultStatusType = "403" | "404" | "500";

interface ErrorProps {
  message: string;
  status?: number;
}

export default function Error({ status }: ErrorProps) {
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const getErrorContent = (): {
    status: ResultStatusType;
    displayStatus: number | string;
    title: string;
    subTitle: string;
    extra?: React.ReactNode;
  } => {
    switch (status) {
      case 404:
        return {
          status: "404",
          displayStatus: 404,
          title: "Page not found",
          subTitle: "Sorry, the page you visited does not exist.",
          extra: (
            <Button size="large" onClick={() => router.back()} type="primary">
              Go back
            </Button>
          ),
        };
      case 401:
        return {
          status: "403",
          displayStatus: 401,
          title: "Unauthorized",
          subTitle: "Sorry, you are not authorized to access this page.",
          extra: undefined,
        };
      case 403:
        return {
          status: "403",
          displayStatus: 403,
          title: "Forbidden",
          subTitle: "Sorry, you don't have permission to access this page.",
          extra: undefined,
        };
      case 500:
        return {
          status: "500",
          displayStatus: 500,
          title: "Server Error",
          subTitle: "Sorry, something went wrong.",
          extra: (
            <Button size="large" onClick={() => router.back()} type="primary">
              Go back
            </Button>
          ),
        };
      default:
        return {
          status: "500",
          displayStatus: 500,
          title: "Sorry, something went wrong.",
          subTitle: "An unexpected error occurred.",
          extra: (
            <Button size="large" onClick={() => router.back()} type="primary">
              Go back
            </Button>
          ),
        };
    }
  };

  const {
    status: resultStatus,
    displayStatus,
    title,
    subTitle,
    extra,
  } = getErrorContent();

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
      <Result
        status={resultStatus}
        title={`${displayStatus} - ${title}`}
        subTitle={subTitle}
        extra={extra}
      />
    </Content>
  );
}
