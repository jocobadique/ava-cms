"use client";

import { Breadcrumb, Flex, Layout, theme, Typography } from "antd";
import { CalendarFilled } from "@ant-design/icons";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import PractitionerInfo from "@/components/practitioners/info";
import { getClinicPractitionerService } from "@/services/practitioners";
import { use } from "react";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { AxiosError } from "axios";

const { Content } = Layout;
const { Text } = Typography;

export default function PractitionerIdPage({
  params: asyncParams,
}: {
  params: Promise<{ practitionerId: string }>;
}) {
  const params = use(asyncParams);
  const practitionerId = params.practitionerId;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data, error, isLoading } = useQuery({
    queryKey: ["practitioner", practitionerId],
    queryFn: () => getClinicPractitionerService(practitionerId),
    enabled: !!practitionerId, // Avoid fetching if practitionerId is not available
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
              title: <Link href={"/user/practitioners"}>Practitioners</Link>,
            },
            {
              title: data?.account?.display_name,
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
        <PractitionerInfo data={data} />
      </Content>
    </>
  );
}
