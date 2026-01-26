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
import {
  Edit,
  Eye,
  Network,
  RotateCw,
  Stethoscope,
  Trash,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EditModal from "./edit";
import { deleteClinicPractitionersService } from "@/services/practitioners";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AssociateModal from "./associate";

const { Title, Text } = Typography;

interface PractitionersTableProps {
  data: any;
  setFilteredData: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  pagination: any;
  onTableChange: (pagination: any, filter: any, sorter: any) => void;
}

export default function PractitionersTable({
  data,
  setFilteredData,
  isLoading,
  pagination,
  onTableChange,
}: PractitionersTableProps) {
  const queryClient = useQueryClient();
  const { modal, message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleMenuClick = (key: string, row: any) => {
    switch (key) {
      case "1": // View
        router.push(`/user/practitioners/${row.id}/`);
        break;
      case "2": // Edit
        setSelectedRow(row); // Set selected row data
        setIsEditModalOpen(true); // Open the modal
        break;
      case "3": // Delete
        handleDelete(row);
        break;
      case "4": // Associate
        setSelectedRow(row); // Set selected row data
        setIsAssociateModalOpen(true); // Open the modal
        break;
      default:
        break;
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedRow(null);
  };

  const handleAssociateModalClose = () => {
    setIsAssociateModalOpen(false);
    setSelectedRow(null);
  };

  // Define Delete mutation using useMutation
  const deleteMutation = useMutation({
    mutationFn: (value: any) => deleteClinicPractitionersService(value),
  });

  const handleDelete = (row: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      content: (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Are you sure you want to delete this practitioner?
            </Text>
            <Text strong>{row?.account?.display_name}</Text>
          </Space>
        </>
      ),
      centered: true,
      mask: false,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        const practitionerId = row.id;
        deleteMutation.mutate(practitionerId, {
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.error?.detail ||
              "Failed to delete practitioner.";
            message.error({ content: errorMessage });
          },
          onSuccess: () => {
            // Remove the row from the filteredData state on successful deletion
            setFilteredData((prev: any) =>
              prev.filter((item: any) => item.id !== practitionerId),
            );
            message.success("Practitioner deleted successfully.");
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["practitioner"] });
            queryClient.invalidateQueries({ queryKey: ["practitioners"] });
            queryClient.invalidateQueries({ queryKey: ["clinic-users"] });
          },
        });
      },
    });
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "Full Name",
      dataIndex: ["account", "display_name"],
      key: "display_name",
      render: (text, record) => (
        <Link href={`/user/practitioners/${record.id}`}>
          <Title level={5} style={{ marginBottom: 0, color: colorPrimary }}>
            {text}
          </Title>
        </Link>
      ),
    },
    {
      title: "Subscription",
      dataIndex: ["account", "subscription"],
      key: "subscription",
      render: (text) => (
        <Text style={{ textTransform: "uppercase" }}>{text}</Text>
      ),
    },
    {
      title: "Practice",
      dataIndex: "practice",
      key: "practice",
      render: (text) => (
        <Text style={{ textTransform: "uppercase" }}>{text}</Text>
      ),
    },
    {
      title: "Branch",
      dataIndex: "branch_name",
      key: "branch_name",
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
          {
            type: "divider",
          },
          {
            key: "4",
            label: "Branch Association",
            icon: <Network size={16} />,
            onClick: () => handleMenuClick("4", row),
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
      {isEditModalOpen && (
        <EditModal
          data={selectedRow}
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
        />
      )}
      {isAssociateModalOpen && (
        <AssociateModal
          data={selectedRow}
          isOpen={isAssociateModalOpen}
          onClose={handleAssociateModalClose}
        />
      )}
    </>
  );
}
