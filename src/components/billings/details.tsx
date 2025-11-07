"use client";

import { formatDate } from "@/utilities/helpers/formatDate";
import { Modal, Divider, Descriptions, Typography, Button, Tag } from "antd";
import type { DescriptionsProps } from "antd";

const { Text } = Typography;

interface DetailsProps {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function DetailsModal({ data, isOpen, onClose }: DetailsProps) {
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
          Name
        </Text>
      ),
      children: <Text strong>{data?.name}</Text>,
    },
    {
      key: "3",
      label: (
        <Text strong type="secondary">
          Status
        </Text>
      ),
      children: (
        <Tag
          style={{ textTransform: "capitalize" }}
          color={data?.payment_status === "paid" ? "green" : "red"}
        >
          {data?.payment_status}
        </Tag>
      ),
    },
    {
      key: "4",
      label: (
        <Text strong type="secondary">
          Amount
        </Text>
      ),
      children: (
        <Text strong>{`${data?.amount_due_currency} ${data?.amount_due}`}</Text>
      ),
    },
    {
      key: "5",
      label: (
        <Text strong type="secondary">
          Usage Start
        </Text>
      ),
      children: <Text strong>{formatDate(data?.usage_start)}</Text>,
    },
    {
      key: "6",
      label: (
        <Text strong type="secondary">
          Usage End
        </Text>
      ),
      children: <Text strong>{formatDate(data?.usage_end)}</Text>,
    },
  ];

  return (
    <Modal
      title="Billing Details"
      centered
      mask={false}
      open={isOpen}
      onCancel={onClose}
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
      footer={[
        <Button size="large" key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Divider />
      <Descriptions
        styles={{
          label: { paddingBottom: 16 },
        }}
        column={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
        items={items}
      />
    </Modal>
  );
}
