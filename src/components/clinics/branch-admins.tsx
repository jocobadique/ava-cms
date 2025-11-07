"use client";

import { useQuery } from "@tanstack/react-query";
import { Flex, Row, Col, Button, Typography, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BranchAdminsTable from "../branch-admins/table";
import { getClinicBranchAdminsService } from "@/services/branch-admins";
import AddModal from "../branch-admins/add";
import Error from "@/components/error";
import { AxiosError } from "axios";

const { Title } = Typography;
const { Search } = Input;

export default function BranchAdmins() {
  const params = useParams();
  const clinicId = params.clinicId;

  const { data, error, isLoading } = useQuery({
    queryKey: ["branch-admins", clinicId],
    queryFn: () => getClinicBranchAdminsService(clinicId),
    enabled: !!clinicId, // Ensure the query runs only when `clinicId` is available
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [searchValue, setSearchValue] = useState("");

  // Update filteredData when clinics data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleSearch = (value: any) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = data.filter((clinicBranchAdmin: any) => {
      return (
        clinicBranchAdmin.display_name
          .toLowerCase()
          .includes(lowercasedValue) ||
        clinicBranchAdmin.subscription
          .toLowerCase()
          .includes(lowercasedValue) ||
        clinicBranchAdmin.branch_name.toLowerCase().includes(lowercasedValue) ||
        clinicBranchAdmin.email.toLowerCase().includes(lowercasedValue)
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
              Lists of Branch Admins
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
        <BranchAdminsTable
          data={filteredData}
          isLoading={isLoading}
          setFilteredData={setFilteredData}
        />
      </Flex>
      {isAddModalOpen && (
        <AddModal isOpen={isAddModalOpen} onClose={handleAddModalClose} />
      )}
    </>
  );
}
