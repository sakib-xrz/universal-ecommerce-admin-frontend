"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Modal,
  Select,
  message,
  Spin,
  Alert,
} from "antd";
import {
  Package,
  User,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  RefreshCw,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  useGetPathaoOrderDetailsQuery,
  useUpdatePathaoOrderStatusMutation,
} from "@/redux/api/pathaoApi";

const { Option } = Select;

// Order status options
const orderStatusOptions = [
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

// Item type mapping
const getItemTypeLabel = (type) => {
  const itemTypes = {
    1: "Document",
    2: "Parcel",
  };
  return itemTypes[type] || "Unknown";
};

// Delivery type mapping
const getDeliveryTypeLabel = (type) => {
  const deliveryTypes = {
    12: "Same Day Delivery (12 hours)",
    24: "Express Delivery (24 hours)",
    48: "Normal Delivery (48 hours)",
  };
  return deliveryTypes[type] || "Unknown";
};

export default function OrderDetails({ orderId }) {
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  // API queries
  const {
    data: orderDetails,
    isLoading,
    error,
    refetch,
  } = useGetPathaoOrderDetailsQuery(orderId, {
    skip: !orderId,
  });

  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdatePathaoOrderStatusMutation();

  const handleStatusUpdate = async () => {
    try {
      await updateOrderStatus({
        orderId: orderDetails?.data.id,
        status: selectedStatus,
      }).unwrap();

      message.success("Order status updated successfully");
      setIsStatusModalVisible(false);
      setSelectedStatus("");
      refetch();
    } catch (error) {
      message.error("Failed to update order status");
    }
  };

  const showStatusModal = () => {
    setSelectedStatus(orderDetails?.data?.status || "");
    setIsStatusModalVisible(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Order Details"
        description={error.message || "Failed to load order details"}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={refetch}>
            Retry
          </Button>
        }
      />
    );
  }

  if (!orderDetails?.data) {
    return (
      <Alert
        message="Order Not Found"
        description="The requested order could not be found"
        type="warning"
        showIcon
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-semibold">
                  Order #{orderDetails?.data.order_id}
                </h2>
                <p className="text-sm text-gray-500">
                  Consignment: {orderDetails?.data.consignment_id}
                </p>
              </div>
            </div>
            <Tag
              color={getStatusColor(orderDetails?.data.status)}
              icon={getStatusIcon(orderDetails?.data.status)}
              className="flex items-center gap-1"
            >
              {orderDetails?.data.status?.toUpperCase()}
            </Tag>
          </div>
          <Space>
            <Button onClick={refetch} icon={<RefreshCw className="h-4 w-4" />}>
              Refresh
            </Button>
            <Button type="primary" onClick={showStatusModal}>
              Update Status
            </Button>
          </Space>
        </div>
      </Card>

      {/* Order Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recipient Information */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Recipient Information
            </div>
          }
        >
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Name">
              {orderDetails?.data.recipient_name}
            </Descriptions.Item>
            <Descriptions.Item label="Primary Phone">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {orderDetails?.data.recipient_phone}
              </div>
            </Descriptions.Item>
            {orderDetails?.data.recipient_secondary_phone && (
              <Descriptions.Item label="Secondary Phone">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {orderDetails?.data.recipient_secondary_phone}
                </div>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Address">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4" />
                <span>{orderDetails?.data.recipient_address}</span>
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Order Details */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </div>
          }
        >
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Item Type">
              {getItemTypeLabel(orderDetails?.data.item_type)}
            </Descriptions.Item>
            <Descriptions.Item label="Delivery Type">
              {getDeliveryTypeLabel(orderDetails?.data.delivery_type)}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity">
              {orderDetails?.data.item_quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Weight">
              {orderDetails?.data.item_weight} kg
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {orderDetails?.data.item_description}
            </Descriptions.Item>
            <Descriptions.Item label="Amount to Collect">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold text-green-600">
                  ৳{orderDetails?.data.amount_to_collect}
                </span>
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      {/* Additional Information */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Additional Information
          </div>
        }
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="Created At">
            {new Date(orderDetails?.data.created_at).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(orderDetails?.data.updated_at).toLocaleString()}
          </Descriptions.Item>
          {orderDetails.special_instruction && (
            <Descriptions.Item label="Special Instructions" span={2}>
              {orderDetails?.data.special_instruction}
            </Descriptions.Item>
          )}
          {orderDetails.tracking_code && (
            <Descriptions.Item label="Tracking Code" span={2}>
              <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                {orderDetails?.data.tracking_code}
              </span>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Status Update Modal */}
      <Modal
        title="Update Order Status"
        open={isStatusModalVisible}
        onOk={handleStatusUpdate}
        onCancel={() => {
          setIsStatusModalVisible(false);
          setSelectedStatus("");
        }}
        confirmLoading={isUpdating}
        okText="Update Status"
      >
        <div className="py-4">
          <p className="mb-4">
            Current Status:{" "}
            <Tag color={getStatusColor(orderDetails?.data?.status)}>
              {orderDetails?.data?.status?.toUpperCase()}
            </Tag>
          </p>
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            placeholder="Select new status"
            className="w-full"
          >
            {orderStatusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
}
