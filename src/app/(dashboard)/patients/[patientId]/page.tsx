"use client";

import { Breadcrumb, Divider, Flex, Layout, theme, Typography } from "antd";
import { CalendarFilled } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getClinicPatientService } from "@/services/patients";
import PatientProfile from "@/components/patients/info";
import { use } from "react";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { AxiosError } from "axios";
import PatientMcoTable from "@/components/patients/mco/table";
import PatientMcoPage from "@/components/patients/mco";

const { Content } = Layout;
const { Text } = Typography;

export default function SubscriberIdPage({
  params: asyncParams,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const params = use(asyncParams);
  const patientId = params.patientId;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data, error, isLoading } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => getClinicPatientService(patientId),
    enabled: !!patientId, // Avoid fetching if subscriberId is not available
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
              title: "Patient",
            },
            {
              title: data?.display_name,
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
          overflow: "auto",
        }}
      >
        <PatientProfile data={data} />
      </Content>
      <PatientMcoPage />
    </>
  );
}
