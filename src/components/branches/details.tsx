"use client";

import { formatDate } from "@/utilities/helpers/formatDate";
import { Modal, Divider, Descriptions, Typography, Button } from "antd";
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
          Address
        </Text>
      ),
      children: <Text strong>{data?.address}</Text>,
    },
    {
      key: "4",
      label: (
        <Text strong type="secondary">
          Clinic
        </Text>
      ),
      children: <Text strong>{data?.clinic_name}</Text>,
    },

    {
      key: "5",
      label: (
        <Text strong type="secondary">
          Created Date
        </Text>
      ),
      children: <Text strong>{formatDate(data?.created)}</Text>,
    },
    {
      key: "6",
      label: (
        <Text strong type="secondary">
          Modified Date
        </Text>
      ),
      children: <Text strong>{formatDate(data?.modified)}</Text>,
    },
  ];

  return (
    <Modal
      title="Branch Details"
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
