"use client";

import { Card, Col, Row, Statistic, Table, theme, Typography } from "antd";
import type { TableProps } from "antd";
import React, { useState } from "react";
import { flattenData } from "@/utilities/helpers/flattenData";

const { Text } = Typography;

interface TotalCardProps {
  data: any;
}

export default function TotalCard({ data }: TotalCardProps) {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const totalEntries = data?.total;
  const flattenTotalData = flattenData(totalEntries);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col flex="100%">
          <Card title="Total" styles={{ title: { color: colorPrimary } }}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                <Statistic
                  title="Total Clinics"
                  value={flattenTotalData.total_clinics}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                <Statistic
                  title="Total Clinic Admins"
                  value={flattenTotalData.total_clinic_admins}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                <Statistic
                  title="Total Prac9"
                  value={flattenTotalData.total_prac9}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                <Statistic
                  title="Total Patients"
                  value={flattenTotalData.total_patients}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                <Statistic
                  title="Total Users"
                  value={flattenTotalData.total_users}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}
