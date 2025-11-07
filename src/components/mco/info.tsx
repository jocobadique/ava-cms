"use client";

import { Button, Descriptions, Divider, Flex, theme, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { DescriptionsProps } from "antd";
import { useState } from "react";
import EditModal from "./edit";
import Link from "next/link";

const { Title, Text } = Typography;

interface InfoProps {
  data: any;
}

export default function McoInfo({ data }: InfoProps) {
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
          Healthcare Provider
        </Text>
      ),
      children: (
        <Link href={`/mco/${data?.id}`}>
          <Text style={{ color: colorPrimary }} strong>
            {data?.name}
          </Text>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Text strong type="secondary">
          MCO ID
        </Text>
      ),
      children: (
        <Text style={{ color: colorPrimary }} strong>
          {data?.code}
        </Text>
      ),
    },
    {
      key: "3",
      label: (
        <Text strong type="secondary">
          Kind
        </Text>
      ),
      children: (
        <Text style={{ textTransform: "capitalize" }} strong>
          {data?.kind}
        </Text>
      ),
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
  ];

  return (
    <>
      <Flex style={{ marginTop: 16 }} vertical gap="large">
        <Flex wrap align="center" justify="space-between" gap="middle">
          <Title style={{ marginBottom: 0 }} level={3}>
            MCO Details
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
        {Array.isArray(data?.contacts) && data.contacts.length > 0 && (
          <>
            <Divider orientation="left" plain orientationMargin={0}>
              <Title level={5}>Contact Number</Title>
            </Divider>

            <Descriptions
              styles={{
                label: { paddingBottom: 16 },
              }}
              column={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
              items={data.contacts.map((contact: any, index: number) => ({
                key: `contact-${index}`,
                label: (
                  <Text strong type="secondary">
                    {contact.label || `Contact ${index + 1}`}
                  </Text>
                ),
                children: <Text strong>{contact.phone || "N/A"}</Text>,
              }))}
            />
          </>
        )}
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
