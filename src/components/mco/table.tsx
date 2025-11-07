"use client";

import {
  App,
  Button,
  Col,
  Descriptions,
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
import React, { useEffect, useState } from "react";
import { Edit, Eye, RotateCw, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMcoService } from "@/services/mco";
import EditModal from "./edit";

const { Title, Text } = Typography;

interface McosTableProps {
  data: any;
  isLoading: boolean;
  setFilteredData: React.Dispatch<React.SetStateAction<any>>;
  filter: any;
  setFilter: React.Dispatch<React.SetStateAction<any>>;
}

export default function McosTable({
  data,
  isLoading,
  setFilteredData,
  filter,
  setFilter,
}: McosTableProps) {
  const queryClient = useQueryClient();
  const { modal, message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
    mutationFn: (value: any) => deleteMcoService(value),
  });

  const handleDelete = (row: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      content: (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Are you sure you want to delete this MCO?
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
        const mcoId = row.id;
        deleteMutation.mutate(mcoId, {
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.error?.detail || "Failed to delete MCO.";
            message.error({ content: errorMessage });
          },
          onSuccess: () => {
            // Remove the row from the filteredData state on successful deletion
            setFilteredData((prev: any) =>
              prev.filter((item: any) => item.id !== mcoId)
            );
            message.success("MCO deleted successfully.");
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["mco"] });
            queryClient.invalidateQueries({ queryKey: ["mcos"] });
          },
        });
      },
    });
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (text) => <Text style={{ color: colorPrimary }}>{text}</Text>,
    },
    {
      title: "Healthcare Provider",
      dataIndex: "name",
      key: "name",
      showSorterTooltip: {
        target: "sorter-icon",
        title: "Sort alphabetically",
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Link href={`/mco/${record.id}`}>
          <Title level={5} style={{ marginBottom: 0, color: colorPrimary }}>
            {text}
          </Title>
        </Link>
      ),
    },
    {
      title: "Kind",
      dataIndex: "kind",
      key: "kind",
      render: (kind: any) => (
        <Text style={{ textTransform: "capitalize" }}>{kind}</Text>
      ),
      filters: [
        {
          text: "Unknown",
          value: "unknown",
        },
        {
          text: "HMO",
          value: "hmo",
        },
        {
          text: "Insurance",
          value: "insurance",
        },
        {
          text: "Prepaid",
          value: "prepaid",
        },
      ],
      filteredValue: filter.kind || null,
      onFilter: (value, record) => record.kind.indexOf(value as string) === 0,
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

  const handleTableChange = (pagination: any, filters: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });

    let filteredData = data;

    if (filters.kind && filters.kind.length > 0) {
      filteredData = filteredData.filter((item: any) =>
        filters.kind.includes(item.kind)
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
        expandable={{
          expandedRowRender: (record) => {
            if (
              !Array.isArray(record.contacts) ||
              record.contacts.length === 0
            ) {
              return <Text type="secondary">No contacts available</Text>;
            }

            return (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <Descriptions title="Contact Number" column={1}>
                      {record.contacts.map((contact: any, index: any) => (
                        <Descriptions.Item key={index} label={contact.label}>
                          {contact.phone}
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  </Col>
                  {record.notes ? (
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                      <Descriptions title="Notes" column={1}>
                        <Descriptions.Item>{record.notes}</Descriptions.Item>
                      </Descriptions>
                    </Col>
                  ) : null}
                </Row>
              </>
            );
          },
        }}
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
