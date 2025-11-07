"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  Col,
  Flex,
  Layout,
  Row,
  Tabs,
  theme,
  Typography,
} from "antd";
import type { TabsProps } from "antd";
import { CalendarFilled } from "@ant-design/icons";
import Link from "next/link";
import { getBasicStatsService } from "@/services/business-intelligence";
import BasicTable from "@/components/business-intelligence/basic-stats/basic/table";
import ProTable from "@/components/business-intelligence/basic-stats/pro/table";
import BizTable from "@/components/business-intelligence/basic-stats/biz/table";
import PrimeTable from "@/components/business-intelligence/basic-stats/prime/table";
import TotalCard from "@/components/business-intelligence/basic-stats/total/card";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { AxiosError } from "axios";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function BasicStatsPage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data, error, isLoading } = useQuery({
    queryKey: ["basic-stats"],
    queryFn: getBasicStatsService,
  });

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Basic",
      children: (
        <>
          <BasicTable data={data} />
        </>
      ),
    },
    {
      key: "2",
      label: "Pro",
      children: (
        <>
          <ProTable data={data} />
        </>
      ),
    },
    {
      key: "3",
      label: "Biz",
      children: (
        <>
          <BizTable data={data} />
        </>
      ),
    },
    {
      key: "4",
      label: "Prime",
      children: (
        <>
          <PrimeTable data={data} />
        </>
      ),
    },

    {
      key: "6",
      label: "Total",
      children: (
        <>
          <TotalCard data={data} />
        </>
      ),
    },
  ];

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
              title: "Business Intel",
            },
            {
              title: <Link href={"/general"}>Basic Stats</Link>,
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
        <Flex vertical gap="large">
          <Row gutter={[16, 16]}>
            <Col flex="100%">
              <Title style={{ marginBottom: 0 }} level={3}>
                Active Accounts
              </Title>
            </Col>
            <Col flex="100%">
              <Tabs
                size="large"
                defaultActiveKey="1"
                items={items}
                onChange={onChange}
              />
            </Col>
          </Row>
        </Flex>
      </Content>
    </>
  );
}
