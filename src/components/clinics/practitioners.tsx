"use client";

import { getClinicPractitionersService } from "@/services/practitioners";
import { useQuery } from "@tanstack/react-query";
import { Flex, Row, Col, Button, Typography, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import PractitionersTable from "../practitioners/table";
import { useParams } from "next/navigation";
import AddModal from "../practitioners/add";
import Error from "@/components/error";
import { AxiosError } from "axios";

const { Title } = Typography;
const { Search } = Input;

export default function Practitioners() {
  const params = useParams();
  const clinicId = params.clinicId;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ["practitioner", clinicId, pagination],
    queryFn: () =>
      getClinicPractitionersService(
        clinicId,
        pagination.current,
        pagination.pageSize,
      ),
    enabled: !!clinicId, // Ensure the query runs only when `clinicId` is available
  });

  const practitioners = data?.data ?? [];
  const paginationMetadata = data?.pagination || {};

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(practitioners);
  const [searchValue, setSearchValue] = useState("");

  // Update filteredData when clinics data changes
  useEffect(() => {
    if (JSON.stringify(filteredData) !== JSON.stringify(practitioners)) {
      setFilteredData(practitioners);
    }
  }, [practitioners]);

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleSearch = (value: any) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = practitioners.filter((practitioner: any) => {
      return (
        practitioner.account.display_name
          .toLowerCase()
          .includes(lowercasedValue) ||
        practitioner.account.subscription
          .toLowerCase()
          .includes(lowercasedValue) ||
        practitioner.practice.toLowerCase().includes(lowercasedValue) ||
        practitioner.branch_name.toLowerCase().includes(lowercasedValue)
      );
    });
    setFilteredData(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.trim() === "") {
      setFilteredData(practitioners); // Reset to all data if input is cleared
    }
  };

  const handleTableChange = (newPagination: any) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

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
      <Flex style={{ marginTop: 16 }} vertical gap="large">
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
            <Title style={{ marginBottom: 0 }} level={3}>
              List of Practitioners
            </Title>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
            <Row wrap gutter={[8, 8]} justify="end" align="middle">
              <Col flex="auto">
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
                xs={{ flex: "auto" }}
                sm={{ flex: "auto" }}
                md={{ flex: "none" }}
                lg={{ flex: "none" }}
                xl={{ flex: "none" }}
                xxl={{ flex: "none" }}
              >
                <Button
                  block
                  onClick={() => setIsAddModalOpen(true)}
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
        <PractitionersTable
          data={filteredData}
          setFilteredData={setFilteredData}
          isLoading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: paginationMetadata.count || 0,
            showTotal: (total: any, range: any) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          onTableChange={handleTableChange}
        />
      </Flex>
      {isAddModalOpen && (
        <AddModal isOpen={isAddModalOpen} onClose={handleAddModalClose} />
      )}
    </>
  );
}
