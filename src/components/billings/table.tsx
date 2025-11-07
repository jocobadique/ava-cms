"use client";

import { Button, Dropdown, Table, Tag, theme, Typography } from "antd";
import type { TableProps } from "antd";
import type { MenuProps } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { formatDate } from "@/utilities/helpers/formatDate";
import DetailsModal from "./details";

const { Title, Text } = Typography;

interface BillingsTableProps {
  data: any;
  isLoading: boolean;
  filter: any;
  setFilter: React.Dispatch<React.SetStateAction<any>>;
}

export default function BillingsTable({
  data,
  isLoading,
  filter,
  setFilter,
}: BillingsTableProps) {
  const {
    token: { colorPrimary },
  } = theme.useToken();

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
      default:
        break;
    }
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedRow(null);
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
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (text) => <Text>{formatDate(text)}</Text>,
    },
    {
      title: "Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status: any) => {
        return (
          <>
            {status === "paid" ? (
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
          text: "Paid",
          value: "paid",
        },
        {
          text: "Unpaid",
          value: "unpaid",
        },
      ],
      filteredValue: filter.payment_status || null,
      onFilter: (value, record) =>
        record.payment_status.indexOf(value as string) === 0,
    },
    {
      title: "Amount",
      dataIndex: "amount_due",
      key: "amount_due",
      render: (text, record) => (
        <Text>{`${record.amount_due_currency} ${text}`}</Text>
      ),
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

    if (filters.payment_status && filters.payment_status.length > 0) {
      filteredData = data.filter((item: any) =>
        filters.payment_status.includes(item.payment_status ? "Paid" : "Unpaid")
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
    </>
  );
}
