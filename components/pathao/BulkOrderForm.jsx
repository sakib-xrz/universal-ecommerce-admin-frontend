"use client";

import { useState } from "react";
import {
  Form,
  Button,
  Card,
  Upload,
  Table,
  message,
  Modal,
  Progress,
  Alert,
} from "antd";
import { Upload as UploadIcon, Download, Plus, Trash2 } from "lucide-react";
import { useCreatePathaoBulkOrdersMutation } from "@/redux/api/pathaoApi";

const { Dragger } = Upload;

export default function BulkOrderForm({ onOrdersCreated }) {
  const [orders, setOrders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const [createBulkOrders, { isLoading }] = useCreatePathaoBulkOrdersMutation();

  // Sample CSV template
  const csvTemplate = `order_id,recipient_name,recipient_phone,recipient_secondary_phone,recipient_address,delivery_type,item_type,special_instruction,item_quantity,item_weight,item_description,amount_to_collect,recipient_city,recipient_zone,recipient_area
ORD-001,John Doe,01712345678,01787654321,"House 123, Road 4, Sector 10, Uttara, Dhaka-1230",48,2,"Please deliver before 5 PM",1,0.5,"Clothing items",900,1,3069,1234
ORD-002,Jane Smith,01812345678,,"Flat 5B, Building 7, Gulshan-2, Dhaka-1212",24,1,"Handle with care",2,0.3,"Documents",500,1,3070,1235`;

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pathao_bulk_orders_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (text) => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",");
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim() || "";
        });
        data.push(row);
      }
    }

    return data;
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = parseCSV(e.target.result);
        setOrders(csvData);
        message.success(`${csvData.length} orders loaded from CSV`);
      } catch (error) {
        message.error("Error parsing CSV file");
      }
    };
    reader.readAsText(file);
    return false; // Prevent default upload
  };

  const validateOrders = (orderList) => {
    const errors = [];
    const requiredFields = [
      "order_id",
      "recipient_name",
      "recipient_phone",
      "recipient_address",
      "delivery_type",
      "item_type",
      "item_quantity",
      "item_weight",
      "item_description",
      "amount_to_collect",
      "recipient_city",
      "recipient_zone",
    ];

    orderList.forEach((order, index) => {
      const missingFields = requiredFields.filter(
        (field) => !order[field] || order[field].toString().trim() === "",
      );
      if (missingFields.length > 0) {
        errors.push(`Row ${index + 1}: Missing ${missingFields.join(", ")}`);
      }

      // Validate phone number
      const phoneRegex = /^(\+88|88)?(01[3-9]\d{8})$/;
      if (
        order.recipient_phone &&
        !phoneRegex.test(order.recipient_phone.replace(/\s/g, ""))
      ) {
        errors.push(`Row ${index + 1}: Invalid phone number format`);
      }
    });

    return errors;
  };

  const handleBulkSubmit = async () => {
    if (orders.length === 0) {
      message.error("Please upload orders first");
      return;
    }

    const validationErrors = validateOrders(orders);
    if (validationErrors.length > 0) {
      Modal.error({
        title: "Validation Errors",
        content: (
          <div>
            <p>Please fix the following errors:</p>
            <ul className="mt-2">
              {validationErrors.slice(0, 10).map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
            {validationErrors.length > 10 && (
              <p className="mt-2 text-sm text-gray-500">
                ... and {validationErrors.length - 10} more errors
              </p>
            )}
          </div>
        ),
        width: 600,
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Transform orders to match API format
      const transformedOrders = orders.map((order) => ({
        order_id: order.order_id,
        recipient_name: order.recipient_name,
        recipient_phone: order.recipient_phone,
        recipient_secondary_phone: order.recipient_secondary_phone || "",
        recipient_address: order.recipient_address,
        delivery_type: parseInt(order.delivery_type),
        item_type: parseInt(order.item_type),
        special_instruction: order.special_instruction || "",
        item_quantity: parseInt(order.item_quantity),
        item_weight: order.item_weight.toString(),
        item_description: order.item_description,
        amount_to_collect: parseFloat(order.amount_to_collect),
        recipient_city: parseInt(order.recipient_city),
        recipient_zone: parseInt(order.recipient_zone),
        recipient_area: order.recipient_area
          ? parseInt(order.recipient_area)
          : undefined,
      }));

      const response = await createBulkOrders({
        orders: transformedOrders,
      }).unwrap();

      setResults(response);
      setProgress(100);
      message.success("Bulk orders processed successfully!");

      if (onOrdersCreated) {
        onOrdersCreated(response);
      }
    } catch (error) {
      message.error(error.message || "Failed to create bulk orders");
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      width: 120,
    },
    {
      title: "Recipient",
      dataIndex: "recipient_name",
      key: "recipient_name",
      width: 150,
    },
    {
      title: "Phone",
      dataIndex: "recipient_phone",
      key: "recipient_phone",
      width: 120,
    },
    {
      title: "Address",
      dataIndex: "recipient_address",
      key: "recipient_address",
      ellipsis: true,
    },
    {
      title: "Amount",
      dataIndex: "amount_to_collect",
      key: "amount_to_collect",
      width: 100,
      render: (amount) => `৳${amount}`,
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record, index) => (
        <Button
          type="text"
          danger
          icon={<Trash2 className="h-4 w-4" />}
          onClick={() => {
            const newOrders = orders.filter((_, i) => i !== index);
            setOrders(newOrders);
          }}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card title="Upload Bulk Orders" size="small">
        <div className="space-y-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Upload a CSV file with order details. Download the template to see
              the required format.
            </p>
            <Button
              icon={<Download className="h-4 w-4" />}
              onClick={downloadTemplate}
            >
              Download Template
            </Button>
          </div>

          <Dragger
            accept=".csv"
            beforeUpload={handleFileUpload}
            showUploadList={false}
            className="border-dashed"
          >
            <p className="ant-upload-drag-icon">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
            </p>
            <p className="ant-upload-text">
              Click or drag CSV file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for CSV files only. Make sure to follow the template
              format.
            </p>
          </Dragger>
        </div>
      </Card>

      {/* Orders Preview */}
      {orders.length > 0 && (
        <Card
          title={`Orders Preview (${orders.length} orders)`}
          extra={
            <Button
              type="primary"
              icon={<Plus className="h-4 w-4" />}
              onClick={handleBulkSubmit}
              loading={isLoading || isProcessing}
              disabled={orders.length === 0}
            >
              Create All Orders
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="order_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} orders`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      )}

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <div className="text-center">
            <h3 className="mb-4">Processing Orders...</h3>
            <Progress percent={progress} status="active" />
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we create your orders
            </p>
          </div>
        </Card>
      )}

      {/* Results */}
      {results && (
        <Card title="Processing Results">
          <div className="space-y-4">
            <Alert
              message={`Successfully processed ${results.successful || 0} orders`}
              type="success"
              showIcon
            />

            {results.failed && results.failed.length > 0 && (
              <Alert
                message={`${results.failed.length} orders failed`}
                description={
                  <div className="mt-2">
                    <p>Failed orders:</p>
                    <ul className="mt-1">
                      {results.failed.slice(0, 5).map((failure, index) => (
                        <li key={index} className="text-sm">
                          {failure.order_id}: {failure.error}
                        </li>
                      ))}
                    </ul>
                    {results.failed.length > 5 && (
                      <p className="mt-1 text-sm text-gray-500">
                        ... and {results.failed.length - 5} more failures
                      </p>
                    )}
                  </div>
                }
                type="error"
                showIcon
              />
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
