"use client";

import { Breadcrumb, Flex, Layout, theme, Typography } from "antd";
import { CalendarFilled } from "@ant-design/icons";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMcoService } from "@/services/mco";
import McoInfo from "@/components/mco/info";
import { use } from "react";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { AxiosError } from "axios";

const { Content } = Layout;
const { Text } = Typography;

export default function McoIdPage({
  params: asyncParams,
}: {
  params: Promise<{ mcoId: string }>;
}) {
  const params = use(asyncParams);
  const mcoId = params.mcoId;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data, error, isLoading } = useQuery({
    queryKey: ["mco", mcoId],
    queryFn: () => getMcoService(mcoId),
    enabled: !!mcoId, // Avoid fetching if mcoId is not available
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    const axiosError = error as AxiosError;
    return (
      <Error
        message={axiosError.message}
        status={axiosError.response?.status}
      />
    );
  }

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
              title: <Link href={"/mco"}>MCO</Link>,
            },
            {
              title: data?.name,
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
          overflow: "auto",
        }}
      >
        <McoInfo data={data} />
      </Content>
    </>
  );
}
