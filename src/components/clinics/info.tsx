"use client";

import { formatCustomDate } from "@/utilities/helpers/formatCustomDate";
import { replaceCharactersWithSpace } from "@/utilities/helpers/replaceCharactersWithSpace";
import { Button, Descriptions, Flex, theme, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { DescriptionsProps } from "antd";
import { useState } from "react";
import EditModal from "./edit";
import Link from "next/link";

const { Title, Text } = Typography;

interface ClinicInfoProps {
  data: any;
}

export default function ClinicInfo({ data }: ClinicInfoProps) {
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
          Name
        </Text>
      ),
      children: <Text strong>{data?.name}</Text>,
    },
    {
      key: "2",
      label: (
        <Text strong type="secondary">
          ID
        </Text>
      ),
      children: <Text strong>{data?.id}</Text>,
    },
    {
      key: "3",
      label: (
        <Text strong type="secondary">
          Active
        </Text>
      ),
      children: (
        <Text strong>{data?.is_active === true ? "TRUE" : "FALSE"}</Text>
      ),
    },
    {
      key: "4",
      label: (
        <Text strong type="secondary">
          Inactive Reason
        </Text>
      ),
      children: (
        <Text style={{ textTransform: "uppercase" }} strong>
          {replaceCharactersWithSpace(data?.inactive_reason, "_") ||
            data?.inactive_reason}
        </Text>
      ),
    },
    {
      key: "5",
      label: (
        <Text strong type="secondary">
          Handle
        </Text>
      ),
      children: <Text strong>{data?.handle}</Text>,
    },
    {
      key: "6",
      label: (
        <Text strong type="secondary">
          Subscriber
        </Text>
      ),
      children: (
        <Link href={`/user/subscribers/${data?.subscriber_id}`}>
          <Text style={{ color: colorPrimary }} strong>
            {data?.subscriber}
          </Text>
        </Link>
      ),
    },
    {
      key: "7",
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
      key: "8",
      label: (
        <Text strong type="secondary">
          For Approval
        </Text>
      ),
      children: (
        <Text style={{ textTransform: "uppercase" }} strong>
          {replaceCharactersWithSpace(data?.approval_status, "_") ||
            data?.approval_status}
        </Text>
      ),
    },
    {
      key: "9",
      label: (
        <Text strong type="secondary">
          Contact
        </Text>
      ),
      children: <Text strong>{data?.contact_number}</Text>,
    },
    {
      key: "10",
      label: (
        <Text strong type="secondary">
          License
        </Text>
      ),
      children: <Text strong>{data?.license_number}</Text>,
    },
    {
      key: "11",
      label: (
        <Text strong type="secondary">
          Data Allocation
        </Text>
      ),
      children: <Text strong>{`${data?.datacap?.alloted} GB`}</Text>,
    },
    {
      key: "12",
      label: (
        <Text strong type="secondary">
          Data Used
        </Text>
      ),
      children: <Text strong>{`${data?.datacap?.consumed} GB`}</Text>,
    },
    {
      key: "13",
      label: (
        <Text strong type="secondary">
          Remaining
        </Text>
      ),
      children: <Text strong>{`${data?.datacap?.remaining}`}</Text>,
    },
    {
      key: "14",
      label: (
        <Text strong type="secondary">
          Data Last Used
        </Text>
      ),
      children: <Text strong>{formatCustomDate(data?.datacap?.modified)}</Text>,
    },
    {
      key: "15",
      label: (
        <Text strong type="secondary">
          Create Date
        </Text>
      ),
      children: <Text strong>{formatCustomDate(data?.created)}</Text>,
    },
    {
      key: "16",
      label: (
        <Text strong type="secondary">
          Modified Date
        </Text>
      ),
      children: <Text strong>{formatCustomDate(data?.modified)}</Text>,
    },
  ];

  return (
    <>
      <Flex style={{ marginTop: 16 }} vertical gap="large">
        <Flex wrap align="center" justify="space-between" gap="middle">
          <Title style={{ marginBottom: 0 }} level={3}>
            Clinic Info
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
