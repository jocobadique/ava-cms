"use client";

import { formatDate } from "@/utilities/helpers/formatDate";
import { replaceCharactersWithSpace } from "@/utilities/helpers/replaceCharactersWithSpace";
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
          Email
        </Text>
      ),
      children: <Text strong>{data?.email}</Text>,
    },
    {
      key: "4",
      label: (
        <Text strong type="secondary">
          First Name
        </Text>
      ),
      children: <Text strong>{data?.first_name}</Text>,
    },

    {
      key: "5",
      label: (
        <Text strong type="secondary">
          Middle Name
        </Text>
      ),
      children: <Text strong>{data?.middle_name}</Text>,
    },
    {
      key: "6",
      label: (
        <Text strong type="secondary">
          Last Name
        </Text>
      ),
      children: <Text strong>{data?.last_name}</Text>,
    },
    {
      key: "7",
      label: (
        <Text strong type="secondary">
          Display Name
        </Text>
      ),
      children: <Text strong>{data?.display_name}</Text>,
    },
    {
      key: "8",
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
      key: "9",
      label: (
        <Text strong type="secondary">
          Contact Number
        </Text>
      ),
      children: (
        <Text style={{ textTransform: "uppercase" }} strong>
          {data?.contact_number}
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
      children: <Text strong>{formatDate(data?.date_joined)}</Text>,
    },
  ];

  return (
    <Modal
      title="Clinic Admin Details"
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
