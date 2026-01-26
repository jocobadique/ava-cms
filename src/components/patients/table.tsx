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
import Link from "next/link";
import EditModal from "./edit";
import { deleteClinicPatientService } from "@/services/patients";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

interface ClinicPatientsTableProps {
  data: any;
  isLoading: boolean;
  setFilteredData: React.Dispatch<React.SetStateAction<any>>;
  pagination: any;
  onTableChange: (pagination: any, filter: any, sorter: any) => void;
}

export default function ClinicPatientsTable({
  data,
  isLoading,
  setFilteredData,
  pagination,
  onTableChange,
}: ClinicPatientsTableProps) {
  const queryClient = useQueryClient();
  const { modal, message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleMenuClick = (key: string, row: any) => {
    switch (key) {
      case "1": // View
        router.push(`/patients/${row.id}/`);
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

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedRow(null);
  };

  // Define Delete mutation using useMutation
  const deleteMutation = useMutation({
    mutationFn: (value: any) => deleteClinicPatientService(value),
  });

  const handleDelete = (row: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      content: (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Are you sure you want to delete this patient?
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
        const clinicPatientId = row.id;
        deleteMutation.mutate(clinicPatientId, {
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.error?.detail ||
              "Failed to delete patient.";
            message.error({ content: errorMessage });
          },
          onSuccess: () => {
            // Remove the row from the filteredData state on successful deletion
            setFilteredData((prev: any) =>
              prev.filter((item: any) => item.id !== clinicPatientId),
            );
            message.success("Patient deleted successfully.");
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] });
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
        <Link href={`/patients/${record.id}`}>
          <Title level={5} style={{ marginBottom: 0, color: colorPrimary }}>
            {text}
          </Title>
        </Link>
      ),
    },
    {
      title: "Branch",
      dataIndex: "branch_name",
      key: "branch_name",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Contac number",
      dataIndex: "contact_number",
      key: "contact_number",
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
