"use client";

import {
  App,
  Button,
  Descriptions,
  Dropdown,
  Space,
  Table,
  theme,
  Typography,
} from "antd";
import type { TableProps } from "antd";
import type { MenuProps } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Edit, Eye, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import EditModal from "./edit";
import { deletePatientMcoService } from "@/services/mco-patient";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "@/utilities/helpers/formatDate";

const { Title, Text } = Typography;

interface PatientMcoTableProps {
  data: any;
  isLoading: boolean;
  setFilteredData: React.Dispatch<React.SetStateAction<any>>;
}

export default function PatientMcoTable({
  data,
  isLoading,
  setFilteredData,
}: PatientMcoTableProps) {
  const queryClient = useQueryClient();
  const { modal, message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const handleMenuClick = (key: string, row: any) => {
    switch (key) {
      case "1": // View
        router.push(`/mco/${row.id}/`);
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
    mutationFn: ({ patientId, mcoId }: { patientId: any; mcoId: any }) =>
      deletePatientMcoService(patientId, mcoId),
  });

  const handleDelete = (row: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      content: (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Are you sure you want to delete this patient mco?
            </Text>
            <Text strong>{row?.mco?.name}</Text>
          </Space>
        </>
      ),
      centered: true,
      mask: false,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        const mcoId = row.id;

        deleteMutation.mutate(
          { patientId, mcoId },
          {
            onError: (error: any) => {
              const errorMessage =
                error?.response?.data?.error?.detail ||
                "Failed to delete patient mco.";
              message.error({ content: errorMessage });
            },
            onSuccess: () => {
              // Remove the row from the filteredData state on successful deletion
              setFilteredData((prev: any) =>
                prev.filter((item: any) => item.id !== mcoId)
              );
              message.success("Patient mco deleted successfully.");
            },
            onSettled: () => {
              queryClient.invalidateQueries({ queryKey: ["mco-patients"] });
            },
          }
        );
      },
    });
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "Healthcare Provider",
      dataIndex: ["mco", "name"],
      key: "name",
      render: (text, record) => (
        <Link href={`/mco/${record.id}`}>
          <Title level={5} style={{ marginBottom: 0, color: colorPrimary }}>
            {text}
          </Title>
        </Link>
      ),
    },
    {
      title: "MCO number",
      dataIndex: "mco_number",
      key: "mco_number",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      render: (text) => (
        <Text style={{ textTransform: "capitalize" }}>{text}</Text>
      ),
    },
    {
      title: "Valid until",
      dataIndex: "valid_until",
      key: "valid_until",
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
        expandable={{
          expandedRowRender: (record) => {
            if (!record.notes) {
              return <Text type="secondary">No notes available</Text>;
            }

            return (
              <>
                <Descriptions title="Notes" column={1}>
                  <Descriptions.Item>{record.notes}</Descriptions.Item>
                </Descriptions>
              </>
            );
          },
        }}
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
