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
import { useRouter } from "next/navigation";
import Link from "next/link";
import EditModal from "./edit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replaceCharactersWithSpace } from "@/utilities/helpers/replaceCharactersWithSpace";
import { deleteCmsAdminService } from "@/services/cms-admins";

const { Title, Text } = Typography;

interface CmsAdminsTableProps {
  data: any;
  isLoading: boolean;
  setFilteredData: React.Dispatch<React.SetStateAction<any>>;
}

export default function CmsAdminsTable({
  data,
  isLoading,
  setFilteredData,
}: CmsAdminsTableProps) {
  const queryClient = useQueryClient();
  const { modal, message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const handleMenuClick = (key: string, row: any) => {
    switch (key) {
      case "1": // View
        router.push(`/user/cms-admins/${row.id}/`);
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
    mutationFn: (value: any) => deleteCmsAdminService(value),
  });

  const handleDelete = (row: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      content: (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Are you sure you want to delete this cms admin?
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
        const cmsAdminId = row.id;
        deleteMutation.mutate(cmsAdminId, {
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.error?.detail ||
              error?.response?.data?.error?.non_field_errors ||
              "Failed to delete CMS Admin.";
            message.error({ content: errorMessage });
          },
          onSuccess: () => {
            // Remove the row from the filteredData state on successful deletion
            setFilteredData((prev: any) =>
              prev.filter((item: any) => item.id !== cmsAdminId)
            );
            message.success("CMS Admin deleted successfully.");
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["cms-admin"] });
            queryClient.invalidateQueries({ queryKey: ["cms-admins"] });
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
        <Link href={`/user/cms-admins/${record.id}`}>
          <Title level={5} style={{ marginBottom: 0, color: colorPrimary }}>
            {text}
          </Title>
        </Link>
      ),
    },
    {
      title: "CMS Role",
      dataIndex: "cms_role",
      key: "cms_role",
      render: (text) => (
        <Text style={{ textTransform: "uppercase" }}>
          {replaceCharactersWithSpace(text, "_")}
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
          total: data ? data.length : 0,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        rowSelection={rowSelection}
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
