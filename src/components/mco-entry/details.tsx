"use client";

import { formatDate } from "@/utilities/helpers/formatDate";
import {
  Modal,
  Divider,
  Descriptions,
  Typography,
  Button,
  theme,
  Tag,
} from "antd";
import type { DescriptionsProps } from "antd";

const { Title, Text } = Typography;

interface DetailsProps {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function DetailsModal({ data, isOpen, onClose }: DetailsProps) {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: (
        <Text strong type="secondary">
          MCO ID
        </Text>
      ),
      children: <Text strong>{data?.code}</Text>,
    },
    {
      key: "2",
      label: (
        <Text strong type="secondary">
          Healthcare Provider
        </Text>
      ),
      children: (
        <Text style={{ color: colorPrimary }} strong>
          {data?.name}
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
    {
      key: "5",
      label: (
        <Text strong type="secondary">
          Status
        </Text>
      ),
      children: (
        <>
          {data?.status === "new" && (
            <Tag style={{ textTransform: "capitalize" }} color="blue">
              {data?.status}
            </Tag>
          )}
          {data?.status === "approved" && (
            <Tag style={{ textTransform: "capitalize" }} color="green">
              {data?.status}
            </Tag>
          )}
          {data?.status === "declined" && (
            <Tag style={{ textTransform: "capitalize" }} color="red">
              {data?.status}
            </Tag>
          )}
        </>
      ),
    },
    {
      key: "6",
      label: (
        <Text strong type="secondary">
          Notes
        </Text>
      ),
      children: <Text strong>{data?.notes}</Text>,
    },
    {
      key: "7",
      label: (
        <Text strong type="secondary">
          Requesting Clinic
        </Text>
      ),
      children: <Text strong>{data?.requesting_clinic?.name}</Text>,
    },
    {
      key: "8",
      label: (
        <Text strong type="secondary">
          Requester Email
        </Text>
      ),
      children: <Text strong>{data?.requester?.email}</Text>,
    },

    ...(data?.decline_reason
      ? [
          {
            key: "9",
            label: (
              <Text strong type="secondary">
                Decline reason
              </Text>
            ),
            children: <Text strong>{data?.decline_reason}</Text>,
          },
        ]
      : []),
  ];

  return (
    <Modal
      title="MCO Details"
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
      {Array.isArray(data?.contacts) && data.contacts.length > 0 && (
        <>
          <Divider orientation="left" plain orientationMargin={0}>
            <Title level={5}>Contact Number</Title>
          </Divider>

          <Descriptions
            style={{ marginTop: 24 }}
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
    </Modal>
  );
}
