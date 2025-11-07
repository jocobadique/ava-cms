"use client";

import {
  App,
  Badge,
  Button,
  Col,
  Descriptions,
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
import { Edit, Eye, Trash } from "lucide-react";
import EditModal from "./edit";
import { deleteMcoEntryService } from "@/services/mco-entry";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DetailsModal from "./details";

const { Title, Text } = Typography;

interface McoEntryTableProps {
  data: any;
  isLoading: boolean;
  setFilteredData: React.Dispatch<React.SetStateAction<any>>;
  filter: any;
  setFilter: React.Dispatch<React.SetStateAction<any>>;
}

export default function McoEntryTable({
  data,
  isLoading,
  setFilteredData,
  filter,
  setFilter,
}: McoEntryTableProps) {
  const queryClient = useQueryClient();
  const { modal, message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
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
      deleteMcoEntryService(clinicId, branchId),
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
        const branchId = row.id;
        const clinicId = row.clinic_id;

        deleteMutation.mutate(
          { clinicId, branchId },
          {
            onError: (error: any) => {
              const errorMessage =
                error?.response?.data?.error?.detail || "Failed to delete MCO.";
              message.error({ content: errorMessage });
            },
            onSuccess: () => {
              // Remove the row from the filteredData state on successful deletion
              setFilteredData((prev: any) =>
                prev.filter((item: any) => item.id !== branchId)
              );
              message.success("MCO deleted successfully.");
            },
            onSettled: () => {
              queryClient.invalidateQueries({ queryKey: ["mco-entry"] });
            },
          }
        );
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: any) => (
        <>
          {status === "new" && (
            <Tag style={{ textTransform: "capitalize" }} color="blue">
              {status}
            </Tag>
          )}
          {status === "approved" && (
            <Tag style={{ textTransform: "capitalize" }} color="green">
              {status}
            </Tag>
          )}
          {status === "declined" && (
            <Tag style={{ textTransform: "capitalize" }} color="red">
              {status}
            </Tag>
          )}
        </>
      ),
      filters: [
        {
          text: "New",
          value: "new",
        },
        {
          text: "Approved",
          value: "approve",
        },
        {
          text: "Declined",
          value: "decline",
        },
      ],
      filteredValue: filter.status || null,
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
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

    if (filters.status && filters.status.length > 0) {
      filteredData = data.filter((item: any) =>
        filters.status.includes(item.status)
      );
    }

    if (filters.kind && filters.kind.length > 0) {
      filteredData = filteredData.filter((item: any) =>
        filters.kind.includes(item.kind)
      );
    }

    setFilter(filters);
    setFilteredTotal(filteredData.length);
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
            if (
              !Array.isArray(record.contacts) ||
              record.contacts.length === 0
            ) {
              return <Text type="secondary">No contacts available</Text>;
            }

            return (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                    <Descriptions title="Contact Number" column={1}>
                      {record.contacts.map((contact: any, index: any) => (
                        <Descriptions.Item key={index} label={contact.label}>
                          {contact.phone}
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  </Col>
                  {record.notes ? (
                    <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                      <Descriptions title="Notes" column={1}>
                        <Descriptions.Item>{record.notes}</Descriptions.Item>
                      </Descriptions>
                    </Col>
                  ) : null}

                  {record.decline_reason ? (
                    <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                      <Descriptions title="Decline reason" column={1}>
                        <Descriptions.Item>
                          {record.decline_reason}
                        </Descriptions.Item>
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
