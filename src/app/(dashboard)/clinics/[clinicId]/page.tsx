"use client";

import { Breadcrumb, Flex, Layout, Tabs, theme, Typography } from "antd";
import type { TabsProps } from "antd";
import { CalendarFilled } from "@ant-design/icons";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getClinicService } from "@/services/clinics";
import ClinicInfo from "@/components/clinics/info";
import ClinicUsers from "@/components/clinics/users";
import Practitioners from "@/components/clinics/practitioners";
import ClinicPatients from "@/components/clinics/patients";
import ClinicAdmins from "@/components/clinics/clinic-admins";
import BranchAdmins from "@/components/clinics/branch-admins";
import BranchStaffs from "@/components/clinics/branch-staffs";
import Branches from "@/components/clinics/branches";
import McoEntry from "@/components/clinics/mco-entry";
import Billings from "@/components/clinics/billings";
import { use } from "react";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { AxiosError } from "axios";

const { Content } = Layout;
const { Text } = Typography;

export default function ClinicIdPage({
  params: asyncParams,
}: {
  params: Promise<{ clinicId: string }>;
}) {
  const params = use(asyncParams);
  const clinicId = params.clinicId;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data, error, isLoading } = useQuery({
    queryKey: ["clinic", clinicId],
    queryFn: () => getClinicService(clinicId),
    enabled: !!clinicId, // Avoid fetching if clinicId is not available
  });

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "clinic-info",
      label: "Clinic Info",
      children: <ClinicInfo data={data} />,
    },
    {
      key: "users",
      label: "Users",
      children: <ClinicUsers />,
    },
    {
      key: "patients",
      label: "Patients",
      children: <ClinicPatients />,
    },
    {
      key: "pracititioners",
      label: "Practitioners",
      children: <Practitioners />,
    },
    {
      key: "clinic-admins",
      label: "Clinic Admins",
      children: <ClinicAdmins />,
    },
    {
      key: "branch-admins",
      label: "Branch Admins",
      children: <BranchAdmins />,
    },
    {
      key: "staff",
      label: "Staff",
      children: <BranchStaffs />,
    },
    {
      key: "branches",
      label: "Branches",
      children: <Branches />,
    },
    {
      key: "mco",
      label: "MCO",
      children: <McoEntry />,
    },

    {
      key: "billing",
      label: "Billing",
      children: <Billings />,
    },
  ];

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
              title: <Link href={"/clinics"}>Clinics</Link>,
            },
            {
              title: data?.name,
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
        <Tabs
          size="large"
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
        />
      </Content>
    </>
  );
}
