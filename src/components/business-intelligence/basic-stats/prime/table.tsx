"use client";

import { Card, Col, Row, Statistic, Table, theme, Typography } from "antd";
import type { TableProps } from "antd";
import React, { useState } from "react";
import { flattenData } from "@/utilities/helpers/flattenData";

const { Text } = Typography;

interface PrimeTableProps {
  data: any;
}

export default function PrimeTable({ data }: PrimeTableProps) {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const primeEntries = data?.prime;
  const flattenPrimeData = flattenData(primeEntries);

  const clinics =
    flattenPrimeData.clinics?.map((clinic: any, index: number) => ({
      ...clinic,
      key: clinic.name || `clinic-${index}`,
    })) || [];

  const columns: TableProps<any>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Text strong style={{ color: colorPrimary }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Total Clinic Admins",
      dataIndex: "total_clinic_admins",
      key: "total_clinic_admins",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Total Patients",
      dataIndex: "total_patients",
      key: "total_patients",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Total Prac9",
      dataIndex: "total_prac9",
      key: "total_prac9",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Total Users",
      dataIndex: "total_users",
      key: "total_users",
      render: (text) => <Text>{text}</Text>,
    },
  ];

  const handleTableChange = (pagination: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col flex="100%">
          <Card title="Prime Plan" styles={{ title: { color: colorPrimary } }}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                <Statistic
                  title="Total Clinics"
                  value={flattenPrimeData.total_clinics}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                <Statistic
                  title="Total Clinic Admins"
                  value={flattenPrimeData.total_clinic_admins}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                <Statistic
                  title="Total Prac9"
                  value={flattenPrimeData.total_prac9}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                <Statistic
                  title="Total Patients"
                  value={flattenPrimeData.total_patients}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                <Statistic
                  title="Total Users"
                  value={flattenPrimeData.total_users}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col flex="100%">
          <Card
            title="Lists of Clinics"
            styles={{ title: { color: colorPrimary } }}
          >
            <Table
              scroll={{ x: 1000 }}
              rowKey="key"
              columns={columns}
              dataSource={clinics || []}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: clinics ? clinics.length : 0,
                showSizeChanger: false,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              onChange={handleTableChange}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
