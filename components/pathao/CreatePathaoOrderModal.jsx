"use client";

import { useState } from "react";
import {
  Modal,
  Row,
  Col,
  Card,
  Descriptions,
  Tag,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  message,
} from "antd";
import { Package, User, MapPin, Phone, Truck, X } from "lucide-react";
import { useCreatePathaoOrderMutation } from "@/redux/api/pathaoApi";
import LocationSelector from "./LocationSelector";
import { formatText } from "@/utils";

const { Option } = Select;
const { TextArea } = Input;

// Item types and delivery types
const itemTypes = [
  { value: 1, label: "Document" },
  { value: 2, label: "Parcel" },
];

const deliveryTypes = [
  { value: 48, label: "Normal Delivery (48 hours)" },
  { value: 24, label: "Express Delivery (24 hours)" },
  { value: 12, label: "Same Day Delivery (12 hours)" },
];

export default function CreatePathaoOrderModal({
  visible,
  onClose,
  orderData,
  onOrderCreated,
}) {
  const [form] = Form.useForm();
  const [locationData, setLocationData] = useState({});
  const [createOrder, { isLoading }] = useCreatePathaoOrderMutation();

  const handleLocationChange = (location) => {
    setLocationData(location);
  };

  const validatePhoneNumber = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Phone number is required"));
    }

    // Bangladesh phone number validation
    const phoneRegex = /^(\+88|88)?(01[3-9]\d{8})$/;
    if (!phoneRegex.test(value.replace(/\s/g, ""))) {
      return Promise.reject(
        new Error("Please enter a valid Bangladesh phone number"),
      );
    }

    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    try {
      // Normalize primary phone number
      let normalizedPhone = values?.recipientPhone || "";
      if (normalizedPhone.startsWith("+88")) {
        normalizedPhone = normalizedPhone.replace("+88", "");
      } else if (normalizedPhone.startsWith("88")) {
        normalizedPhone = normalizedPhone.replace("88", "");
      }

      // Normalize secondary phone number (if provided)
      let normalizedSecondaryPhone = values?.recipientSecondaryPhone || "";
      if (normalizedSecondaryPhone.startsWith("+88")) {
        normalizedSecondaryPhone = normalizedSecondaryPhone.replace("+88", "");
      } else if (normalizedSecondaryPhone.startsWith("88")) {
        normalizedSecondaryPhone = normalizedSecondaryPhone.replace("88", "");
      }

      let orderPayload = {
        order_id: values.orderId,
        recipient_name: values.recipientName,
        recipient_phone: normalizedPhone,
        recipient_secondary_phone: normalizedSecondaryPhone,
        recipient_address: values.recipientAddress,
        delivery_type: values.deliveryType,
        item_type: values.itemType,
        special_instruction: values.specialInstruction,
        item_quantity: values.itemQuantity,
        item_weight: values.itemWeight,
        item_description: values.itemDescription,
        amount_to_collect: values.amountToCollect,
        recipient_city: locationData.cityId,
        recipient_zone: locationData.zoneId,
        recipient_area: locationData.areaId,
      };

      // Remove empty/null/undefined fields
      Object.keys(orderPayload).forEach((key) => {
        if (
          orderPayload[key] === "" ||
          orderPayload[key] === null ||
          orderPayload[key] === undefined
        ) {
          delete orderPayload[key];
        }
      });

      const response = await createOrder(orderPayload).unwrap();

      message.success("Pathao order created successfully!");
      form.resetFields();
      setLocationData({});

      if (onOrderCreated) {
        onOrderCreated(response);
      }

      onClose();
    } catch (error) {
      message.error(error.message || "Failed to create Pathao order");
    }
  };

  // Pre-fill form with order data when modal opens
  const handleModalOpen = () => {
    if (orderData) {
      form.setFieldsValue({
        orderId: orderData?.order_id,
        recipientName: orderData.customer_name,
        recipientPhone: orderData.phone,
        recipientAddress: orderData.address_line,
        amountToCollect: orderData.grand_total,
        itemQuantity: orderData.products?.length || 1,
        itemDescription:
          orderData.products?.map((p) => p.product_name).join(", ") ||
          "Order items",
        itemWeight: 1, // Default weight
        itemType: 2, // Default to Parcel
        deliveryType: 48, // Default to Normal Delivery
      });
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Create Pathao Order
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ maxWidth: 1400 }}
      afterOpenChange={(open) => {
        if (open) {
          handleModalOpen();
        }
      }}
    >
      <Row gutter={24} className="min-h-[600px]">
        {/* Left Side - Order Details */}
        <Col xs={24} lg={10}>
          <div className="space-y-4">
            <Card
              title={
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </div>
              }
              size="small"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-primary">
                    Order ID: #{orderData?.order_id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(orderData?.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <div className="font-medium">
                      {formatText(orderData?.status)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Payment:</span>
                    <div className="font-medium">
                      {formatText(orderData?.payment?.status)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title={
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </div>
              }
              size="small"
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Name">
                  {orderData?.customer_name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {orderData?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {orderData?.phone}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4" />
                    <span>{orderData?.address_line}</span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Location">
                  {orderData?.is_inside_dhaka
                    ? "Inside Dhaka"
                    : "Outside Dhaka"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Order Items" size="small">
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {orderData?.products?.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded bg-gray-50 p-2"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {product.product_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Qty: {product.quantity} | Size:{" "}
                        {product.product_size || "N/A"}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      ৳{product.total_price}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 border-t pt-3">
                <div className="flex items-center justify-between font-semibold">
                  <span>Grand Total:</span>
                  <span className="text-lg text-green-600">
                    ৳{orderData?.grand_total}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </Col>

        {/* Right Side - Pathao Order Form */}
        <Col xs={24} lg={14}>
          <Card title="Pathao Order Form" size="small">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-4"
            >
              {/* Order Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Item
                  label="Order ID"
                  name="orderId"
                  rules={[{ required: true, message: "Please enter order ID" }]}
                >
                  <Input placeholder="Enter unique order ID" />
                </Form.Item>

                <Form.Item
                  label="Amount to Collect"
                  name="amountToCollect"
                  rules={[
                    {
                      required: true,
                      message: "Please enter amount to collect",
                    },
                    {
                      type: "number",
                      min: 0,
                      message: "Amount must be positive",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="Enter amount"
                    prefix="৳"
                    min={0}
                  />
                </Form.Item>
              </div>

              {/* Recipient Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Item
                  label="Recipient Name"
                  name="recipientName"
                  rules={[
                    { required: true, message: "Please enter recipient name" },
                  ]}
                >
                  <Input placeholder="Enter recipient name" />
                </Form.Item>

                <Form.Item
                  label="Primary Phone"
                  name="recipientPhone"
                  rules={[{ validator: validatePhoneNumber }]}
                >
                  <Input placeholder="01XXXXXXXXX" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Item
                  label="Secondary Phone (Optional)"
                  name="recipientSecondaryPhone"
                >
                  <Input placeholder="01XXXXXXXXX" />
                </Form.Item>

                <Form.Item
                  label="Recipient Address"
                  name="recipientAddress"
                  rules={[
                    {
                      required: true,
                      message: "Please enter recipient address",
                    },
                  ]}
                >
                  <TextArea
                    rows={2}
                    placeholder="Enter complete delivery address"
                  />
                </Form.Item>
              </div>

              {/* Location Selection */}
              <div className="rounded-lg border bg-gray-50 p-4">
                <h4 className="mb-4 font-medium">Delivery Location</h4>
                <LocationSelector
                  onLocationChange={handleLocationChange}
                  required={true}
                />
              </div>

              {/* Item Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Form.Item
                  label="Item Type"
                  name="itemType"
                  rules={[
                    { required: true, message: "Please select item type" },
                  ]}
                >
                  <Select placeholder="Select item type">
                    {itemTypes.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Delivery Type"
                  name="deliveryType"
                  rules={[
                    { required: true, message: "Please select delivery type" },
                  ]}
                >
                  <Select placeholder="Select delivery type">
                    {deliveryTypes.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Item Quantity"
                  name="itemQuantity"
                  rules={[
                    { required: true, message: "Please enter item quantity" },
                    {
                      type: "number",
                      min: 1,
                      message: "Quantity must be at least 1",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="Enter quantity"
                    min={1}
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Form.Item
                  label="Item Weight (kg)"
                  name="itemWeight"
                  rules={[
                    { required: true, message: "Please enter item weight" },
                    {
                      type: "number",
                      min: 0.1,
                      message: "Weight must be at least 0.1 kg",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="Enter weight"
                    step={0.1}
                    min={0.1}
                    suffix="kg"
                  />
                </Form.Item>

                <Form.Item
                  label="Item Description"
                  name="itemDescription"
                  rules={[
                    {
                      required: true,
                      message: "Please enter item description",
                    },
                  ]}
                >
                  <Input placeholder="Describe the item" />
                </Form.Item>
              </div>

              <Form.Item
                label="Special Instructions (Optional)"
                name="specialInstruction"
              >
                <TextArea
                  rows={2}
                  placeholder="Any special delivery instructions"
                />
              </Form.Item>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t pt-4">
                <Button onClick={onClose} icon={<X className="h-4 w-4" />}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  disabled={!locationData.cityId || !locationData.zoneId}
                  icon={<Truck className="h-4 w-4" />}
                >
                  Create Pathao Order
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
}
