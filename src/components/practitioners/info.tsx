"use client";

import { formatCustomDate } from "@/utilities/helpers/formatCustomDate";
import { Button, Descriptions, Flex, theme, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { DescriptionsProps } from "antd";
import { useState } from "react";
import EditModal from "./edit";
import Link from "next/link";

const { Title, Text } = Typography;

interface PractitionerInfoProps {
  data: any;
}

export default function PractitionerInfo({ data }: PractitionerInfoProps) {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: (
        <Text strong type="secondary">
          ID
        </Text>
      ),
      children: <Text strong>{data?.id}</Text>,
    },
    {
      key: "2",
      label: (
        <Text strong type="secondary">
          Branch
        </Text>
      ),
      children: <Text strong>{data?.branch_name}</Text>,
    },
    {
      key: "3",
      label: (
        <Text strong type="secondary">
          Clinic
        </Text>
      ),
      children: (
        <Link href={`/clinics/${data?.clinic_id}`}>
          <Text style={{ color: colorPrimary }} strong>
            {data?.clinic_name}
          </Text>
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <Text strong type="secondary">
          Practice
        </Text>
      ),
      children: (
        <Text style={{ textTransform: "uppercase" }} strong>
          {data?.practice}
        </Text>
      ),
    },
    {
      key: "5",
      label: (
        <Text strong type="secondary">
          First Name
        </Text>
      ),
      children: <Text strong>{data?.account?.first_name}</Text>,
    },
    {
      key: "6",
      label: (
        <Text strong type="secondary">
          License Number
        </Text>
      ),
      children: <Text strong>{data?.license_number}</Text>,
    },
    {
      key: "7",
      label: (
        <Text strong type="secondary">
          Middle Name
        </Text>
      ),
      children: <Text strong>{data?.account?.middle_name}</Text>,
    },
    {
      key: "8",
      label: (
        <Text strong type="secondary">
          Email
        </Text>
      ),
      children: <Text strong>{data?.account?.email}</Text>,
    },
    {
      key: "9",
      label: (
        <Text strong type="secondary">
          Last Name
        </Text>
      ),
      children: <Text strong>{data?.account?.last_name}</Text>,
    },
    {
      key: "10",
      label: (
        <Text strong type="secondary">
          Subscription
        </Text>
      ),
      children: (
        <Text style={{ textTransform: "uppercase" }} strong>
          {data?.account?.subscription}
        </Text>
      ),
    },
    {
      key: "11",
      label: (
        <Text strong type="secondary">
          Display Name
        </Text>
      ),
      children: <Text strong>{data?.account?.display_name}</Text>,
    },

    {
      key: "14",
      label: (
        <Text strong type="secondary">
          Date Joined
        </Text>
      ),
      children: (
        <Text strong>{formatCustomDate(data?.account?.date_joined)}</Text>
      ),
    },
  ];

  return (
    <>
      <Flex style={{ marginTop: 16 }} vertical gap="large">
        <Flex wrap align="center" justify="space-between" gap="middle">
          <Title style={{ marginBottom: 0 }} level={3}>
            Practitioner Info
          </Title>
          <Button
            onClick={() => {
              setIsEditModalOpen(true);
            }}
            icon={<EditOutlined />}
            size="large"
            type="primary"
          >
            Edit
          </Button>
        </Flex>
        <Descriptions
          styles={{
            label: { paddingBottom: 16 },
          }}
          column={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
          items={items}
        />
      </Flex>
      {isEditModalOpen && (
        <EditModal
          data={data}
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
        />
      )}
    </>
  );
}
