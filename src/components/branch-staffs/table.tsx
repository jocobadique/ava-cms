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
  theme,
  Typography,
} from "antd";
import type { TableProps } from "antd";
import type { MenuProps } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Edit, Eye, RotateCw, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditModal from "./edit";
import DetailsModal from "./details";
import { deleteClinicBranchStaffService } from "@/services/branch-staffs";

const { Title, Text } = Typography;

interface BranchStaffsTableProps {
  data: any;
  isLoading: boolean;
  setFilteredData: React.Dispatch<React.SetStateAction<any>>;
  pagination: any;
  onTableChange: (pagination: any, filter: any, sorter: any) => void;
}

export default function BranchStaffsTable({
  data,
  isLoading,
  setFilteredData,
  pagination,
  onTableChange,
}: BranchStaffsTableProps) {
  const queryClient = useQueryClient();
  const { modal, message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleMenuClick = (key: string, row: any) => {
    switch (key) {
      case "1": // View
        setSelectedRow(row); // Set selected row data
        setIsDetailsModalOpen(true); // Open the details modal
        break;
      case "2": // Edit
        setSelectedRow(row); // Set selected row data
        setIsEditModalOpen(true); // Open the modal
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

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedRow(null);
  };

  // Define Delete mutation using useMutation
  const deleteMutation = useMutation({
    mutationFn: (value: any) => deleteClinicBranchStaffService(value),
  });

  const handleDelete = (row: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      content: (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Are you sure you want to delete this branch staff?
            </Text>
            <Text strong>{row?.display_name}</Text>
          </Space>
        </>
      ),
      centered: true,
      mask: false,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        const clinicBranchStaffId = row.id;
        deleteMutation.mutate(clinicBranchStaffId, {
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.error?.detail ||
              "Failed to delete clinic branch staff.";
            message.error({ content: errorMessage });
          },
          onSuccess: () => {
            // Remove the row from the filteredData state on successful deletion
            setFilteredData((prev: any) =>
              prev.filter((item: any) => item.id !== clinicBranchStaffId),
            );
            message.success("Branch staff deleted successfully.");
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["branch-staffs"] });
            queryClient.invalidateQueries({ queryKey: ["clinic-users"] });
          },
        });
      },
    });
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "Full Name",
      dataIndex: "display_name",
      key: "display_name",
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
      title: "Branch",
      dataIndex: "branch_name",
      key: "branch_name",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Subscription",
      dataIndex: "subscription",
      key: "subscription",
      render: (text) => (
        <Text style={{ textTransform: "uppercase" }}>{text}</Text>
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
            label: "Edit",
            icon: <Edit size={16} />,
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
        pagination={pagination}
        rowSelection={rowSelection}
        onChange={onTableChange}
      />
      {isDetailsModalOpen && (
        <DetailsModal
          data={selectedRow}
          isOpen={isDetailsModalOpen}
          onClose={handleDetailsModalClose}
        />
      )}
      {isEditModalOpen && (
        <EditModal
          data={selectedRow}
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
        />
      )}
    </>
  );
}
