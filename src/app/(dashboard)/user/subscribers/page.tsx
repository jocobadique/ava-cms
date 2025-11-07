"use client";

import {
  Breadcrumb,
  Button,
  Col,
  Flex,
  Input,
  Layout,
  Row,
  theme,
  Typography,
} from "antd";
import exportFromJSON from "export-from-json";
import moment from "moment";
import { PlusOutlined, CalendarFilled } from "@ant-design/icons";
import { CloudDownload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSubscribersService } from "@/services/subscribers";
import SubscribersTable from "@/components/subscribers/table";
import CreateModal from "@/components/subscribers/create";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { AxiosError } from "axios";
import { useUserStore } from "@/stores/userStore";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

export default function SubscribersPage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const user = useUserStore((state) => state.user);

  const { data, error, isLoading } = useQuery({
    queryKey: ["subscribers"],
    queryFn: getSubscribersService,
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [searchValue, setSearchValue] = useState("");

  // Update filteredData when clinics data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleSearch = (value: any) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = data.filter((subscriber: any) => {
      return (
        subscriber.display_name.toLowerCase().includes(lowercasedValue) ||
        subscriber.subscription.toLowerCase().includes(lowercasedValue) ||
        subscriber.clinic_name.toLowerCase().includes(lowercasedValue) ||
        subscriber.clinic_role.toLowerCase().includes(lowercasedValue) ||
        subscriber.email.toLowerCase().includes(lowercasedValue)
      );
    });
    setFilteredData(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.trim() === "") {
      setFilteredData(data); // Reset to all data if input is cleared
    }
  };

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
          <Row gutter={[16, 16]} justify="space-between" align="middle">
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Title style={{ marginBottom: 0 }} level={3}>
                Lists of Subscribers
              </Title>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row gutter={[8, 8]} justify="center" align="middle">
                <Col
                  xs={{ flex: "100%", order: 3 }}
                  sm={{ flex: "100%", order: 3 }}
                  md={{ flex: "none", order: 1 }}
                  lg={{ flex: "none", order: 1 }}
                  xl={{ flex: "none", order: 1 }}
                  xxl={{ flex: "none", order: 1 }}
                >
                  {(user?.cms_role === undefined ||
                    user?.cms_role === "cms_admin") && (
                    <Button
                      block
                      icon={<CloudDownload />}
                      size="large"
                      onClick={() => {
                        exportFromJSON({
                          data: filteredData,
                          fileName: `subscribers-data(${moment().format(
                            "YYYY-MM-DD"
                          )})`,
                          exportType: exportFromJSON.types.csv,
                          fields: [
                            "display_name",
                            "subscription",
                            "clinic_name",
                            "clinic_role",
                            "email",
                          ],
                        });
                      }}
                    >
                      Export
                    </Button>
                  )}
                </Col>
                <Col
                  xs={{ flex: "auto", order: 2 }}
                  sm={{ flex: "auto", order: 2 }}
                  md={{ flex: "auto", order: 2 }}
                  lg={{ flex: "auto", order: 2 }}
                  xl={{ flex: "auto", order: 2 }}
                  xxl={{ flex: "auto", order: 2 }}
                >
                  <Search
                    placeholder="Search"
                    allowClear
                    size="large"
                    value={searchValue}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                  />
                </Col>
                <Col
                  xs={{ flex: "100%", order: 2 }}
                  sm={{ flex: "100%", order: 2 }}
                  md={{ flex: "none", order: 3 }}
                  lg={{ flex: "none", order: 3 }}
                  xl={{ flex: "none", order: 3 }}
                  xxl={{ flex: "none", order: 3 }}
                >
                  <Button
                    block
                    onClick={() => setIsCreateModalOpen(true)}
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                  >
                    Add new
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <SubscribersTable
            data={filteredData}
            isLoading={isLoading}
            setFilteredData={setFilteredData}
          />
        </Flex>
      </Content>
      {isCreateModalOpen && (
        <CreateModal
          isOpen={isCreateModalOpen}
          onClose={handleCreateModalClose}
        />
      )}
    </>
  );
}
