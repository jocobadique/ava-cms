"use client";

import {
  App,
  Button,
  Col,
  Divider,
  Dropdown,
  Row,
  Space,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import type { TableProps } from "antd";
import type { MenuProps } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Eye, RotateCw, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRecallBillExemptionService,
  deleteBillExemptionService,
} from "@/services/bill-exemption";
import DetailsModal from "./details";

const { Title, Text } = Typography;

interface BillExemptionTableProps {
  data: any;
  isLoading: boolean;
  setFilteredData: React.Dispatch<React.SetStateAction<any>>;
  filter: any;
  setFilter: React.Dispatch<React.SetStateAction<any>>;
}

export default function BillExemptionTable({
  data,
  isLoading,
  setFilteredData,
  filter,
  setFilter,
}: BillExemptionTableProps) {
  const queryClient = useQueryClient();
  const { modal, message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const router = useRouter();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [filteredTotal, setFilteredTotal] = useState(data?.length || 0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    setFilteredTotal(data?.length || 0);
  }, [data]);

  const handleMenuClick = (key: string, row: any) => {
    switch (key) {
      case "1": // View
        setSelectedRow(row); // Set selected row data
        setIsDetailsModalOpen(true); // Open the modal
        break;
      case "2": // Recall
        handleRecall(row);
        break;
      case "3": // Delete
        handleDelete(row);
        break;
      default:
        break;
    }
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedRow(null);
  };

  // Recall mutation
  const recallMutation = useMutation({
    mutationFn: (value: any) => createRecallBillExemptionService(value),
  });

  const handleRecall = (row: any) => {
    modal.confirm({
      title: "Confirm Recall",
      content: (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Are you sure you want to recall this bill exemption?
            </Text>
            <Text strong>{row?.recipient_name}</Text>
          </Space>
        </>
      ),
      centered: true,
      mask: false,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        const billExemptionId = row.id;
        recallMutation.mutate(billExemptionId, {
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.error?.detail ||
              error?.response?.data?.error?.non_field_errors;
            message.error({ content: errorMessage });
          },
          onSuccess: () => {
            message.success("Bill exemption recall successfully.");
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["bill-exemption"] });
            queryClient.invalidateQueries({ queryKey: ["bill-exemptions"] });
          },
        });
      },
    });
  };

  // Define Delete mutation using useMutation
  const deleteMutation = useMutation({
    mutationFn: (value: any) => deleteBillExemptionService(value),
  });

  const handleDelete = (row: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      content: (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Are you sure you want to delete this bill exemption?
            </Text>
            <Text strong>{row?.recipient_name}</Text>
          </Space>
        </>
      ),
      centered: true,
      mask: false,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        const billExemptionId = row.id;
        deleteMutation.mutate(billExemptionId, {
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.error?.detail ||
              error?.response?.data?.error?.non_field_errors ||
              "Failed to delete bill exemption.";
            message.error({ content: errorMessage });
          },
          onSuccess: () => {
            // Remove the row from the filteredData state on successful deletion
            setFilteredData((prev: any) =>
              prev.filter((item: any) => item.id !== billExemptionId)
            );
            message.success("Bill exemption deleted successfully.");
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["bill-exemption"] });
            queryClient.invalidateQueries({ queryKey: ["bill-exemptions"] });
          },
        });
      },
    });
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "Name",
      dataIndex: "recipient_name",
      key: "recipient_name",
      render: (text, record) => (
        <Title
          onClick={() => {
            setSelectedRow(record); // Set selected row data
            setIsDetailsModalOpen(true); // Open the modal
          }}
          level={5}
          style={{ marginBottom: 0, color: colorPrimary, cursor: "pointer" }}
        >
          {text}
        </Title>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: any) => {
        return (
          <>
            {status === "active" ? (
              <Tag style={{ textTransform: "capitalize" }} color="green">
                {status}
              </Tag>
            ) : (
              <Tag style={{ textTransform: "capitalize" }} color="red">
                {status}
              </Tag>
            )}
          </>
        );
      },
      filters: [
        {
          text: "Active",
          value: "active",
        },
        {
          text: "Inactive",
          value: "inactive",
        },
      ],
      filteredValue: filter.status || null,
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
    },
    {
      title: "Subscription",
      dataIndex: "subscription_type",
      key: "subscription_type",
      render: (text) => (
        <Text style={{ textTransform: "uppercase" }}>{text}</Text>
      ),
      filters: [
        {
          text: "Unknown",
          value: "unknown",
        },
        {
          text: "Basic",
          value: "basic",
        },
        {
          text: "Pro",
          value: "pro",
        },
        {
          text: "Biz",
          value: "biz",
        },
        {
          text: "Prime",
          value: "prime",
        },
      ],
      filteredValue: filter.subscription_type || null,
      onFilter: (value, record) =>
        record.subscription_type.indexOf(value as string) === 0,
    },

    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text) => (
        <Text>
          {text} {text === 1 ? "day" : "days"}
        </Text>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      render(_: any, row: any) {
        const menuItems: MenuProps["items"] = [
          {
            key: "1",
            label: "View",
            icon: <Eye size={16} />,
            onClick: () => handleMenuClick("1", row),
          },
          {
            key: "2",
            label: "Recall",
            icon: <RotateCw size={16} />,
            onClick: () => handleMenuClick("2", row),
          },
          {
            key: "3",
            label: "Delete",
            icon: <Trash size={16} />,
            onClick: () => handleMenuClick("3", row),
          },
        ];
        return (
          <>
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              menu={{ items: menuItems }}
            >
              <Button size="large" icon={<EllipsisOutlined />} type="text" />
            </Dropdown>
          </>
        );
      },
      align: "center",
    },
  ];

  const handleTableChange = (pagination: any, filters: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });

    let filteredData = data;

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filteredData = data.filter((item: any) =>
        filters.status.includes(item.status ? "Active" : "Inactive")
      );
    }

    // Filter by subscription_type
    if (filters.subscription_type && filters.subscription_type.length > 0) {
      filteredData = filteredData.filter((item: any) =>
        filters.subscription_type.includes(item.subscription_type)
      );
    }

    setFilter(filters);
    setFilteredTotal(filteredData.length);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      {hasSelected && (
        <>
          <Row align="middle">
            <Col>
              <Text>Selected {selectedRowKeys.length} Item</Text>
            </Col>
            <Divider type="vertical" />
            <Col>
              <Button icon={<Trash size={16} />} type="link" danger>
                Delete
              </Button>
            </Col>
            <Divider type="vertical" />
            <Col>
              <Button
                icon={<RotateCw size={16} />}
                type="link"
                onClick={() => {
                  setSelectedRowKeys([]);
                }}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </>
      )}

      <Table
        loading={isLoading}
        scroll={{ x: 1000 }}
        rowKey="id"
        columns={columns}
        dataSource={data || []}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: filteredTotal,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        rowSelection={rowSelection}
        onChange={handleTableChange}
      />
      {isDetailsModalOpen && (
        <DetailsModal
          data={selectedRow}
          isOpen={isDetailsModalOpen}
          onClose={handleDetailsModalClose}
        />
      )}
    </>
  );
}
