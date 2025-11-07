"use client";

import { formatCustomDate } from "@/utilities/helpers/formatCustomDate";
import { Button, Descriptions, Flex, theme, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { DescriptionsProps } from "antd";
import { useState } from "react";
import EditModal from "./edit";
import Link from "next/link";
import { replaceCharactersWithSpace } from "@/utilities/helpers/replaceCharactersWithSpace";

const { Title, Text } = Typography;

interface SubscriberInfoProps {
  data: any;
}

export default function SubscriberInfo({ data }: SubscriberInfoProps) {
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
      key: "2",
      label: (
        <Text strong type="secondary">
          Clinic Role
        </Text>
      ),
      children: (
        <Text style={{ textTransform: "uppercase" }} strong>
          {replaceCharactersWithSpace(data?.clinic_role, "_")}
        </Text>
      ),
    },
    {
      key: "3",
      label: (
        <Text strong type="secondary">
          ID
        </Text>
      ),
      children: <Text strong>{data?.id}</Text>,
    },
    {
      key: "4",
      label: (
        <Text strong type="secondary">
          Email
        </Text>
      ),
      children: <Text strong>{data?.email}</Text>,
    },
    {
      key: "5",
      label: (
        <Text strong type="secondary">
          First Name
        </Text>
      ),
      children: <Text strong>{data?.first_name}</Text>,
    },

    {
      key: "6",
      label: (
        <Text strong type="secondary">
          Middle Name
        </Text>
      ),
      children: <Text strong>{data?.middle_name}</Text>,
    },
    {
      key: "7",
      label: (
        <Text strong type="secondary">
          Last Name
        </Text>
      ),
      children: <Text strong>{data?.last_name}</Text>,
    },
    {
      key: "8",
      label: (
        <Text strong type="secondary">
          Display Name
        </Text>
      ),
      children: <Text strong>{data?.display_name}</Text>,
    },
    {
      key: "9",
      label: (
        <Text strong type="secondary">
          Subscription
        </Text>
      ),
      children: (
        <Text style={{ textTransform: "uppercase" }} strong>
          {data?.subscription}
        </Text>
      ),
    },
    {
      key: "10",
      label: (
        <Text strong type="secondary">
          Date Joined
        </Text>
      ),
      children: <Text strong>{formatCustomDate(data?.date_joined)}</Text>,
    },
    {
      key: "11",
      label: (
        <Text strong type="secondary">
          Payment Term
        </Text>
      ),
      children: (
        <Text style={{ textTransform: "uppercase" }} strong>
          {data?.payment_term}
        </Text>
      ),
    },
  ];

  return (
    <>
      <Flex style={{ marginTop: 16 }} vertical gap="large">
        <Flex wrap align="center" justify="space-between" gap="middle">
          <Title style={{ marginBottom: 0 }} level={3}>
            Subscriber Info
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
