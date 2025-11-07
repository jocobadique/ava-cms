"use client";

import { App, Button, Dropdown, Space, Table, theme, Typography } from "antd";
import type { TableProps } from "antd";
import type { MenuProps } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Edit, Eye, Trash } from "lucide-react";
import EditModal from "./edit";
import { deleteClinicBranchService } from "@/services/branches";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/utilities/helpers/formatDate";
import DetailsModal from "./details";

const { Title, Text } = Typography;

interface BranchesTableProps {
  data: any;
  isLoading: boolean;
  setFilteredData: React.Dispatch<React.SetStateAction<any>>;
}

export default function BranchesTable({
  data,
  isLoading,
  setFilteredData,
}: BranchesTableProps) {
  const queryClient = useQueryClient();
  const { modal, message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const handleMenuClick = (key: string, row: any) => {
    switch (key) {
      case "1": // View
        setSelectedRow(row); // Set selected row data
        setIsDetailsModalOpen(true); // Open the details modal
        break;
      case "2": // Edit
        setSelectedRow(row); // Set selected row data
        setIsEditModalOpen(true); // Open the edit modal
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
    mutationFn: ({ clinicId, branchId }: { clinicId: any; branchId: any }) =>
      deleteClinicBranchService(clinicId, branchId),
  });

  const handleDelete = (row: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      content: (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Are you sure you want to delete this branch?
            </Text>
            <Text strong>{row?.name}</Text>
          </Space>
        </>
      ),
      centered: true,
      mask: false,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        const branchId = row.id;
        const clinicId = row.clinic_id;

        deleteMutation.mutate(
          { clinicId, branchId },
          {
            onError: (error: any) => {
              const errorMessage =
                error?.response?.data?.error?.detail ||
                "Failed to delete branch.";
              message.error({ content: errorMessage });
            },
            onSuccess: () => {
              // Remove the row from the filteredData state on successful deletion
              setFilteredData((prev: any) =>
                prev.filter((item: any) => item.id !== branchId)
              );
              message.success("Branch deleted successfully.");
            },
            onSettled: () => {
              queryClient.invalidateQueries({ queryKey: ["branches"] });
            },
          }
        );
      },
    });
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Created Date",
      dataIndex: "created",
      key: "created",
      render: (text) => <Text>{formatDate(text)}</Text>,
    },
    {
      title: "Modified Date",
      dataIndex: "modified",
      key: "modified",
      render: (text) => <Text>{formatDate(text)}</Text>,
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

  const handleTableChange = (pagination: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  return (
    <>
      <Table
        loading={isLoading}
        scroll={{ x: 1000 }}
        rowKey="id"
        columns={columns}
        dataSource={data || []}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data ? data.length : 0,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={handleTableChange}
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
