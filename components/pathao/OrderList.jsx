"use client";

import { useState } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Tooltip,
  Modal,
  message,
} from "antd";
import {
  Eye,
  Search,
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  useGetPathaoOrdersQuery,
  useUpdatePathaoOrderStatusMutation,
} from "@/redux/api/pathaoApi";
import { useRouter } from "next/navigation";

const { Option } = Select;
const { Search: AntSearch } = Input;

// Order status options
const orderStatusOptions = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "picked_up", label: "Picked Up" },
  { value: "in_transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];

// Status color mapping
const getStatusColor = (status) => {
  const statusColors = {
    pending: "orange",
    confirmed: "blue",
    picked_up: "cyan",
    in_transit: "purple",
    delivered: "green",
    cancelled: "red",
    returned: "volcano",
  };
  return statusColors[status?.toLowerCase()] || "default";
};

// Status icon mapping
const getStatusIcon = (status) => {
  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    confirmed: <Package className="h-4 w-4" />,
    picked_up: <Truck className="h-4 w-4" />,
    in_transit: <Truck className="h-4 w-4" />,
    delivered: <CheckCircle className="h-4 w-4" />,
    cancelled: <XCircle className="h-4 w-4" />,
    returned: <RefreshCw className="h-4 w-4" />,
  };
  return statusIcons[status?.toLowerCase()] || <Package className="h-4 w-4" />;
};

export default function OrderList() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // API queries
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useGetPathaoOrdersQuery({
    page: currentPage,
    limit: pageSize,
    search: searchText,
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  console.log(ordersData?.data, "ordersData");
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdatePathaoOrderStatusMutation();

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleViewOrder = (orderId) => {
    router.push(`/super-admin/pathao/orders/${orderId}`);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      message.success("Order status updated successfully");
      refetch();
    } catch (error) {
      message.error("Failed to update order status");
    }
  };

  const showStatusUpdateModal = (record) => {
    Modal.confirm({
      title: "Update Order Status",
      content: (
        <div className="py-4">
          <p>Order ID: {record.order_id}</p>
          <p>Current Status: {record.status}</p>
          <Select
            placeholder="Select new status"
            className="mt-2 w-full"
            onChange={(value) => {
              Modal.destroyAll();
              handleStatusUpdate(record.id, value);
            }}
          >
            {orderStatusOptions
              .filter((option) => option.value !== "all")
              .map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
          </Select>
        </div>
      ),
      okText: "Update",
      cancelText: "Cancel",
    });
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      render: (text) => (
        <span className="font-mono text-sm font-medium">{text}</span>
      ),
    },
    {
      title: "Consignment ID",
      dataIndex: "consignment_id",
      key: "consignment_id",
      render: (text) => (
        <span className="font-mono text-xs text-gray-600">{text}</span>
      ),
    },
    {
      title: "Recipient",
      key: "recipient",
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.recipient_name}</div>
          <div className="text-sm text-gray-500">{record.recipient_phone}</div>
        </div>
      ),
    },
    {
      title: "Address",
      dataIndex: "recipient_address",
      key: "recipient_address",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          <span className="text-sm">{address}</span>
        </Tooltip>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount_to_collect",
      key: "amount_to_collect",
      render: (amount) => <span className="font-medium">৳{amount}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={getStatusColor(status)}
          icon={getStatusIcon(status)}
          className="flex w-fit items-center gap-1"
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (
        <span className="text-sm">
          {new Date(date).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<Eye className="h-4 w-4" />}
              onClick={() => handleViewOrder(record.id)}
            />
          </Tooltip>
          <Tooltip title="Update Status">
            <Button
              type="text"
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={() => showStatusUpdateModal(record)}
              loading={isUpdating}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Pathao Orders
        </div>
      }
      extra={
        <Button
          icon={<RefreshCw className="h-4 w-4" />}
          onClick={refetch}
          loading={isLoading}
        >
          Refresh
        </Button>
      }
    >
      {/* Filters */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <AntSearch
            placeholder="Search by Order ID, Consignment ID, or Recipient"
            allowClear
            enterButton={<Search className="h-4 w-4" />}
            size="middle"
            onSearch={handleSearch}
            className="w-full sm:w-80"
          />
          <Select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="w-full sm:w-40"
            size="middle"
          >
            {orderStatusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Table
        columns={columns}
        dataSource={ordersData?.data || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: ordersData?.meta?.total || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} orders`,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        scroll={{ x: 1200 }}
      />

      {/* Error Display */}
      {error && (
        <div className="mt-4 text-center text-red-500">
          <p>Error loading orders: {error.message}</p>
          <Button onClick={refetch} className="mt-2">
            Try Again
          </Button>
        </div>
      )}
    </Card>
  );
}
