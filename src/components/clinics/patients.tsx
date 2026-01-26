"use client";

import { useQuery } from "@tanstack/react-query";
import { Flex, Row, Col, Button, Typography, Input, Select } from "antd";
import {
  EnvironmentOutlined,
  GlobalOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ClinicPatientsTable from "../patients/table";
import {
  getClinicBranchPatientsService,
  getClinicPatientsService,
} from "@/services/patients";
import { getClinicBranchesService } from "@/services/branches";
import AddModal from "../patients/add";
import Error from "@/components/error";
import { AxiosError } from "axios";

const { Title } = Typography;
const { Search } = Input;

export default function ClinicPatients() {
  const params = useParams();
  const clinicId = params.clinicId;

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const [branchId, setBranchId] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const { data: branchesData, isLoading: isBranchesDataLoading } = useQuery({
    queryKey: ["branches", clinicId],
    queryFn: () => getClinicBranchesService(clinicId),
    enabled: !!clinicId,
  });

  // --- Fetch Patients (Dynamic API Switching) ---
  const { data, error, isLoading } = useQuery({
    queryKey: [
      "patients",
      clinicId,
      branchId,
      pagination.current,
      pagination.pageSize,
    ],
    queryFn: () => {
      // If branchId exists (is not null/undefined), fetch by branch
      if (branchId) {
        return getClinicBranchPatientsService(
          clinicId,
          branchId,
          pagination.current,
          pagination.pageSize,
        );
      }
      // Default: Fetch all clinic patients
      return getClinicPatientsService(
        clinicId,
        pagination.current,
        pagination.pageSize,
      );
    },
    enabled: !!clinicId,
  });

  const clinicPatients = data?.data ?? [];
  const paginationMetadata = data?.pagination || {};

  // Update filteredData when clinics data changes
  useEffect(() => {
    if (JSON.stringify(filteredData) !== JSON.stringify(clinicPatients)) {
      setFilteredData(clinicPatients);
    }
  }, [clinicPatients]);

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleSearch = (value: any) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = clinicPatients.filter((clinicPatient: any) => {
      return (
        clinicPatient.display_name.toLowerCase().includes(lowercasedValue) ||
        clinicPatient.subscription.toLowerCase().includes(lowercasedValue) ||
        clinicPatient.branch_name.toLowerCase().includes(lowercasedValue) ||
        clinicPatient.email.toLowerCase().includes(lowercasedValue)
      );
    });
    setFilteredData(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.trim() === "") {
      setFilteredData(clinicPatients); // Reset to all data if input is cleared
    }
  };

  const handleTableChange = (newPagination: any) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleBranchChange = (value: string | null) => {
    setBranchId(value);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset pagination on filter change
    setSearchValue("");
  };

  // Combine static "All" option with dynamic branch data
  const branchOptions = [
    {
      value: null,
      label: (
        <Flex gap={8} align="center">
          <GlobalOutlined /> <span>All Branches</span>
        </Flex>
      ),
    }, // Static "All" option
    ...(branchesData?.map((branch: any) => ({
      value: branch.id,
      label: (
        <Flex gap={8} align="center">
          <EnvironmentOutlined /> <span>{branch.name}</span>
        </Flex>
      ),
    })) || []),
  ];

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
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Title style={{ marginBottom: 0 }} level={3}>
              List of Patients
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
                <Select
                  loading={isBranchesDataLoading}
                  size="large"
                  value={branchId}
                  onChange={handleBranchChange}
                  options={branchOptions}
                  popupMatchSelectWidth={false}
                  style={{
                    width: "100%",
                    minWidth: 180,
                  }}
                />
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

        <ClinicPatientsTable
          data={filteredData}
          isLoading={isLoading}
          setFilteredData={setFilteredData}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: paginationMetadata.count || 0,
            showTotal: (total: number, range: [number, number]) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          onTableChange={handleTableChange}
        />
      </Flex>

      {isAddModalOpen && (
        <AddModal
          isOpen={isAddModalOpen}
          onClose={handleAddModalClose}
          selectedBranchId={branchId}
        />
      )}
    </>
  );
}
