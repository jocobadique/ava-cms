"use client";

import { useQuery } from "@tanstack/react-query";
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
import { useEffect, useState } from "react";
import Link from "next/link";
import BillExemptionTable from "@/components/bill-exemption/table";
import CreateModal from "@/components/bill-exemption/create";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { AxiosError } from "axios";
import { useUserStore } from "@/stores/userStore";
import { getBillExemptionsService } from "@/services/bill-exemption";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

export default function BillExemptionPage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const user = useUserStore((state) => state.user);

  const { data, error, isLoading } = useQuery({
    queryKey: ["bill-exemptions"],
    queryFn: getBillExemptionsService,
  });

  console.log(data, "Bill Exemption");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState({});

  // Update filteredData when bill exemption data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleSearch = (value: any) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = data.filter((billExemption: any) => {
      return (
        billExemption.recipient_name.toLowerCase().includes(lowercasedValue) ||
        billExemption.email.toLowerCase().includes(lowercasedValue)
      );
    });
    setFilteredData(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.trim() === "") {
      setFilteredData(data); // Reset to all data if input is cleared
      setFilter({
        status: [], // Reset the status filter
        subscription_type: [], // Reset the subscription filter
      });
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
              title: <Link href={"/bill-exemption"}>Bill Exemption</Link>,
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
                Lists of Bill Exemption
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
                          fileName: `bill-exemption-data(${moment().format(
                            "YYYY-MM-DD"
                          )})`,
                          exportType: exportFromJSON.types.csv,
                          fields: [
                            "recepient_name",
                            "status",
                            "subscription_type",
                            "duration",
                            "subscription_date",
                            "create",
                            "modified",
                            "activate_date",
                            "deactivate_date",
                            "email",
                            "inactive_reason",
                            "subscriber",
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
          <BillExemptionTable
            data={filteredData}
            isLoading={isLoading}
            setFilteredData={setFilteredData}
            filter={filter}
            setFilter={setFilter}
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
