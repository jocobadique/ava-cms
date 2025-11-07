"use client";

import { useQuery } from "@tanstack/react-query";
import { Flex, Row, Col, Button, Typography, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import McoEntryTable from "../mco-entry/table";
import { useParams } from "next/navigation";
import { getMcoEntryService } from "@/services/mco-entry";
import AddModal from "../mco-entry/add";
import Error from "@/components/error";
import { AxiosError } from "axios";

const { Title } = Typography;
const { Search } = Input;

export default function McoEntry() {
  const params = useParams();
  const clinicId = params.clinicId;

  const { data, error, isLoading } = useQuery({
    queryKey: ["mco-entry", clinicId],
    queryFn: () => getMcoEntryService(clinicId),
    enabled: !!clinicId, // Ensure the query runs only when `clinicId` is available
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState({});

  // Update filteredData when mco data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleSearch = (value: any) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = data.filter((mcoEntry: any) => {
      return (
        mcoEntry.code.toLowerCase().includes(lowercasedValue) ||
        mcoEntry.name.toLowerCase().includes(lowercasedValue) ||
        mcoEntry.kind.toLowerCase().includes(lowercasedValue) ||
        mcoEntry.email.toLowerCase().includes(lowercasedValue)
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
        kind: [], // Reset the kind filter
      });
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
              MCO Requests
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
        <McoEntryTable
          data={filteredData}
          isLoading={isLoading}
          setFilteredData={setFilteredData}
          filter={filter}
          setFilter={setFilter}
        />
      </Flex>
      {isAddModalOpen && (
        <AddModal isOpen={isAddModalOpen} onClose={handleAddModalClose} />
      )}
    </>
  );
}
