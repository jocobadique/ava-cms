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
          Generic name
        </Text>
      ),
      children: <Text strong>{data?.generic_name}</Text>,
    },
    {
      key: "3",
      label: (
        <Text strong type="secondary">
          Brand name
        </Text>
      ),
      children: <Text strong>{data?.brand_name}</Text>,
    },
    {
      key: "4",
      label: (
        <Text strong type="secondary">
          Dosage
        </Text>
      ),
      children: (
        <Text style={{ textTransform: "capitalize" }} strong>
          {data?.dosage}
        </Text>
      ),
    },
  ];

  return (
    <Modal
      title="Drug Details"
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
