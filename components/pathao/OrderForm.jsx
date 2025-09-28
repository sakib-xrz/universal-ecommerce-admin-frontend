"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  InputNumber,
  message,
  Divider,
} from "antd";
import { Package, Plus, Calculator } from "lucide-react";
import { useCreatePathaoOrderMutation } from "@/redux/api/pathaoApi";
import LocationSelector from "./LocationSelector";
import PriceCalculator from "./PriceCalculator";

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

export default function OrderForm({ onOrderCreated }) {
  const [form] = Form.useForm();
  const [locationData, setLocationData] = useState({});
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [showPriceCalculator, setShowPriceCalculator] = useState(false);

  const [createOrder, { isLoading }] = useCreatePathaoOrderMutation();

  const handleLocationChange = (location) => {
    setLocationData(location);
  };

  const handlePriceCalculated = (priceData) => {
    setCalculatedPrice(priceData);
    setShowPriceCalculator(false);
    message.success("Price calculated successfully!");
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

  //   const handleSubmit = async (values) => {
  //     try {
  //       // Prepare order data
  //       const orderData = {
  //         order_id: values.orderId,
  //         recipient_name: values.recipientName,
  //         recipient_phone: values.recipientPhone,
  //         recipient_secondary_phone: values.recipientSecondaryPhone || "",
  //         recipient_address: values.recipientAddress,
  //         delivery_type: values.deliveryType,
  //         item_type: values.itemType,
  //         special_instruction: values.specialInstruction || "",
  //         item_quantity: values.itemQuantity,
  //         item_weight: values.itemWeight.toString(),
  //         item_description: values.itemDescription,
  //         amount_to_collect: values.amountToCollect,
  //         recipient_city: locationData.cityId,
  //         recipient_zone: locationData.zoneId,
  //         recipient_area: locationData.areaId,
  //       };

  //       const response = await createOrder(orderData).unwrap();

  //       message.success("Order created successfully!");
  //       form.resetFields();
  //       setLocationData({});
  //       setCalculatedPrice(null);

  //       if (onOrderCreated) {
  //         onOrderCreated(response);
  //       }
  //     } catch (error) {
  //       message.error(error.message || "Failed to create order");
  //     }
  //   };

  const handleSubmit = async (values) => {
    try {
      // Prepare order data
      let orderData = {
        order_id: values.orderId,
        recipient_name: values.recipientName,
        recipient_phone: values.recipientPhone,
        recipient_secondary_phone: values.recipientSecondaryPhone,
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

      // Remove keys with empty string, null or undefined
      Object.keys(orderData).forEach((key) => {
        if (
          orderData[key] === "" ||
          orderData[key] === null ||
          orderData[key] === undefined
        ) {
          delete orderData[key];
        }
      });

      const response = await createOrder(orderData).unwrap();

      message.success("Order created successfully!");
      form.resetFields();
      setLocationData({});
      setCalculatedPrice(null);

      if (onOrderCreated) {
        onOrderCreated(response);
      }
    } catch (error) {
      message.error(error.message || "Failed to create order");
    }
  };

  return (
    <div className="space-y-6">
      {/* Price Calculator Toggle */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span>Price Calculator</span>
            {calculatedPrice && (
              <span className="ml-2 font-semibold text-green-600">
                ৳{calculatedPrice.price || calculatedPrice.total_price}
              </span>
            )}
          </div>
          <Button
            type={showPriceCalculator ? "default" : "primary"}
            size="small"
            onClick={() => setShowPriceCalculator(!showPriceCalculator)}
          >
            {showPriceCalculator ? "Hide Calculator" : "Calculate Price"}
          </Button>
        </div>
      </Card>

      {/* Price Calculator */}
      {showPriceCalculator && (
        <PriceCalculator onPriceCalculated={handlePriceCalculated} />
      )}

      {/* Order Form */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Create Pathao Order
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          {/* Order Information */}
          <Card type="inner" title="Order Information" size="small">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Order ID"
                  name="orderId"
                  rules={[
                    {
                      required: true,
                      message: "Please enter order ID",
                    },
                  ]}
                >
                  <Input placeholder="Enter unique order ID" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
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
              </Col>
            </Row>
          </Card>

          {/* Recipient Information */}
          <Card type="inner" title="Recipient Information" size="small">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Recipient Name"
                  name="recipientName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter recipient name",
                    },
                  ]}
                >
                  <Input placeholder="Enter recipient name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Primary Phone"
                  name="recipientPhone"
                  rules={[{ validator: validatePhoneNumber }]}
                >
                  <Input placeholder="01XXXXXXXXX" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Secondary Phone (Optional)"
                  name="recipientSecondaryPhone"
                >
                  <Input placeholder="01XXXXXXXXX" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
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
                    rows={3}
                    placeholder="Enter complete delivery address"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Location Selection */}
            <div className="rounded-lg border bg-gray-50 p-4">
              <h4 className="mb-4 font-medium">Delivery Location</h4>
              <LocationSelector
                onLocationChange={handleLocationChange}
                required={true}
              />
            </div>
          </Card>

          {/* Item Information */}
          <Card type="inner" title="Item Information" size="small">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Item Type"
                  name="itemType"
                  rules={[
                    {
                      required: true,
                      message: "Please select item type",
                    },
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
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Delivery Type"
                  name="deliveryType"
                  rules={[
                    {
                      required: true,
                      message: "Please select delivery type",
                    },
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
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Item Quantity"
                  name="itemQuantity"
                  rules={[
                    {
                      required: true,
                      message: "Please enter item quantity",
                    },
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
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Item Weight (kg)"
                  name="itemWeight"
                  rules={[
                    {
                      required: true,
                      message: "Please enter item weight",
                    },
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
              </Col>
              <Col xs={24} md={12}>
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
              </Col>
            </Row>

            <Form.Item
              label="Special Instructions (Optional)"
              name="specialInstruction"
            >
              <TextArea
                rows={2}
                placeholder="Any special delivery instructions"
              />
            </Form.Item>
          </Card>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={!locationData.cityId || !locationData.zoneId}
              icon={<Plus className="h-4 w-4" />}
              size="large"
              className="w-full"
            >
              Create Order
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
