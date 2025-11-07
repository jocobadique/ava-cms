"use client";

import { Breadcrumb, Flex, Layout, theme, Typography } from "antd";
import { CalendarFilled } from "@ant-design/icons";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getSubscriberService } from "@/services/subscribers";
import SubscriberInfo from "@/components/subscribers/info";
import { use } from "react";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { AxiosError } from "axios";

const { Content } = Layout;
const { Text } = Typography;

export default function SubscriberIdPage({
  params: asyncParams,
}: {
  params: Promise<{ subscriberId: string }>;
}) {
  const params = use(asyncParams);
  const subscriberId = params.subscriberId;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data, error, isLoading } = useQuery({
    queryKey: ["subscriber", subscriberId],
    queryFn: () => getSubscriberService(subscriberId),
    enabled: !!subscriberId, // Avoid fetching if subscriberId is not available
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
              title: "User",
            },
            {
              title: <Link href={"/user/subscribers"}>Subscribers</Link>,
            },
            {
              title: data?.display_name,
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
        <SubscriberInfo data={data} />
      </Content>
    </>
  );
}
