"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  Card,
  Col,
  Flex,
  Layout,
  Row,
  Statistic,
  theme,
  Typography,
} from "antd";
import { CalendarFilled } from "@ant-design/icons";
import Link from "next/link";
import { getGeneralsService } from "@/services/business-intelligence";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { AxiosError } from "axios";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function GeneralPage() {
  const {
    token: { colorPrimary, colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data, error, isLoading } = useQuery({
    queryKey: ["generals"],
    queryFn: getGeneralsService,
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
              title: "Business Intel",
            },
            {
              title: <Link href={"/general"}>General</Link>,
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
                Active Subscribers
              </Title>
            </Col>
            <Col flex="100%" style={{ marginTop: 16 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Card
                    title="Basic Plan"
                    styles={{ title: { color: colorPrimary } }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <Statistic
                          title="Subscriptions"
                          value={data?.basic?.subscriptions}
                        />
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <Statistic
                          title="Total Users"
                          value={data?.basic?.total_users}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Card
                    title="Pro Plan"
                    styles={{ title: { color: colorPrimary } }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <Statistic
                          title="Subscriptions"
                          value={data?.pro?.subscriptions}
                        />
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <Statistic
                          title="Total Users"
                          value={data?.pro?.total_users}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Card
                    title="Biz Plan"
                    styles={{ title: { color: colorPrimary } }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <Statistic
                          title="Subscriptions"
                          value={data?.biz?.subscriptions}
                        />
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <Statistic
                          title="Total Users"
                          value={data?.biz?.total_users}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Card
                    title="Prime Plan"
                    styles={{ title: { color: colorPrimary } }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <Statistic
                          title="Subscriptions"
                          value={data?.prime?.subscriptions}
                        />
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <Statistic
                          title="Total Users"
                          value={data?.prime?.total_users}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <Card
                    title="Extra"
                    styles={{ title: { color: colorPrimary } }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
                        <Statistic
                          title="Clinic Users"
                          value={data?.extra?.total_clinic_users}
                        />
                      </Col>
                      <Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
                        <Statistic
                          title="Total Subscriptions"
                          value={data?.extra?.total_subscriptions}
                        />
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                        <Statistic
                          title="Clinics"
                          value={data?.extra?.total_clinics}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Flex>
      </Content>
    </>
  );
}
