"use client";

import { useQuery } from "@tanstack/react-query";
import { Flex, Row, Col, Typography, Input } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BillingsTable from "../billings/table";
import { getClinicBillingsService } from "@/services/billings";
import Error from "@/components/error";
import { AxiosError } from "axios";

const { Title } = Typography;
const { Search } = Input;

export default function Billings() {
  const params = useParams();
  const clinicId = params.clinicId;

  const { data, error, isLoading } = useQuery({
    queryKey: ["billings", clinicId],
    queryFn: () => getClinicBillingsService(clinicId),
    enabled: !!clinicId, // Ensure the query runs only when `clinicId` is available
  });

  const [filteredData, setFilteredData] = useState(data);
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState({});

  // Update filteredData when clinics data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (value: any) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = data.filter((billing: any) => {
      return (
        billing.name.toLowerCase().includes(lowercasedValue) ||
        billing.due_date.toLowerCase().includes(lowercasedValue) ||
        billing.amount_due.toLowerCase().includes(lowercasedValue) ||
        billing.created.toLowerCase().includes(lowercasedValue) ||
        billing.modified.toLowerCase().includes(lowercasedValue)
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
        payment_status: [], // Reset the payment_status filter
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
              Lists of Billings
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
            </Row>
          </Col>
        </Row>
        <BillingsTable
          data={filteredData}
          isLoading={isLoading}
          filter={filter}
          setFilter={setFilter}
        />
      </Flex>
    </>
  );
}
