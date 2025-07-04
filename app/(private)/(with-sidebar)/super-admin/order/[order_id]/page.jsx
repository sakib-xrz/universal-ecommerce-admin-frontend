"use client";

import TitleWithButton from "@/components/shared/title-with-button";
import {
  useGetSingleOrderQuery,
  useUpdateOrderItemQuantityMutation,
  useUpdateOrderStatusMutation,
} from "@/redux/api/orderApi";
import { orderStatusOptions, paymentStatusOptions } from "@/utils/constant";
import {
  Breadcrumb,
  Select,
  Table,
  Image,
  Input,
  InputNumber,
  Button,
} from "antd";
import Link from "next/link";
import dayjs from "dayjs";
import {
  Check,
  Edit,
  Loader2,
  ShoppingCart,
  Truck,
  User,
  Wallet,
  X,
} from "lucide-react";
import { formatText } from "@/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdatePaymentStatusMutation } from "@/redux/api/paymentApi";

export default function OrderDetails({ params }) {
  const orderId = params.order_id;

  const [openEdit, setOpenEdit] = useState(false);
  const [editableOrderId, setEditableOrderId] = useState(null);
  const [editableQuantity, setEditableQuantity] = useState(null);

  const [
    updateOrderItemQuantity,
    { isLoading: isUpdateOrderItemQuantityLoading },
  ] = useUpdateOrderItemQuantityMutation();

  const handleUpdateOrderItemQuantity = async () => {
    try {
      await updateOrderItemQuantity({
        orderId,
        itemId: editableOrderId,
        data: {
          quantity: editableQuantity,
        },
      }).unwrap();
      toast.success("Order item updated successfully.");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.errorMessages && error.errorMessages.length > 0
          ? error.errorMessages[0]?.message
          : error.message || "Something went wrong!!!",
      );
    } finally {
      setOpenEdit(false);
      setEditableOrderId(null);
      setEditableQuantity(null);
    }
  };

  const items = [
    {
      title: <Link href="/super-admin/dashboard">Dashboard</Link>,
    },
    {
      title: <Link href="/super-admin/order">Order</Link>,
    },
    {
      title: `${orderId}`,
    },
  ];

  const { data, isLoading } = useGetSingleOrderQuery(orderId, {
    skip: !orderId,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

  const handleUpdateOrderStatus = async (status) => {
    try {
      await updateOrderStatus({
        orderId,
        data: {
          status,
        },
      }).unwrap();
      toast.success("Order status updated successfully.");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.errorMessages && error.errorMessages.length > 0
          ? error.errorMessages[0]?.message
          : error.message || "Something went wrong!!!",
      );
    }
  };

  const handleUpdatePaymentStatus = async (status) => {
    try {
      await updatePaymentStatus({
        orderId,
        data: {
          status,
        },
      }).unwrap();
      toast.success("Payment status updated successfully.");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.errorMessages && error.errorMessages.length > 0
          ? error.errorMessages[0]?.message
          : error.message || "Something went wrong!!!",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-160px)] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  const order = data?.data || {};

  const columns = [
    {
      title: <div className="text-center">Action</div>,
      dataIndex: "action",
      key: "action",
      render: (_text, record) => (
        <div className="text-center">
          {openEdit && record.id === editableOrderId ? (
            <div className="flex justify-center gap-3">
              <Button
                shape="circle"
                htmlType="button"
                onClick={() => {
                  setEditableOrderId(null);
                  setOpenEdit(false);
                }}
                size="small"
                danger
                disabled={isUpdateOrderItemQuantityLoading}
              >
                <X size={16} />
              </Button>
              <Button
                shape="circle"
                htmlType="button"
                onClick={() => {
                  handleUpdateOrderItemQuantity();
                }}
                size="small"
                disabled={isUpdateOrderItemQuantityLoading}
              >
                {isUpdateOrderItemQuantityLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                className="flex items-center gap-1 text-info"
                onClick={() => {
                  setOpenEdit(true);
                  setEditableOrderId(record.id);
                }}
              >
                <Edit size={16} />
                Edit
              </button>
            </div>
          )}
        </div>
      ),
      width: 120,
    },
    {
      title: <div className="text-center">Sl.</div>,
      dataIndex: "sl",
      key: "serial_no",
      render: (_text, _record, index) => (
        <div className="text-center">{index + 1}</div>
      ),
    },
    {
      title: <div className="text-center">Image</div>,
      dataIndex: "image",
      key: "image",
      render: (_text, record) => (
        <div className="flex justify-center">
          <Image
            src={
              record?.image_url ||
              "https://res.cloudinary.com/dl5rlskcv/image/upload/v1735927164/default-product_o9po6f.jpg"
            }
            alt={record?.product_name}
            width={50}
            height={50}
          />
        </div>
      ),
    },
    {
      title: <div>Product Name</div>,
      dataIndex: "product_name",
      key: "product_name",
      render: (_text, record) => (
        <div>
          {record?.product_name}{" "}
          <span className="text-gray-500">({record?.sku})</span>
        </div>
      ),
    },
    {
      title: <div className="text-center">Size</div>,
      dataIndex: "size",
      key: "size",
      render: (_text, record) => (
        <div className="text-center">{record?.product_size || "N/A"}</div>
      ),
    },
    {
      title: <div className="text-center">Quantity</div>,
      dataIndex: "quantity",
      key: "quantity",
      render: (_text, record) => (
        <div className="text-center">
          {openEdit && record.id === editableOrderId ? (
            <InputNumber
              min={0}
              max={record?.quantity}
              size="small"
              defaultValue={record?.quantity}
              onChange={(value) => {
                setEditableQuantity(value);
              }}
            />
          ) : (
            record?.quantity
          )}
        </div>
      ),
      width: 130,
    },
    {
      title: <div className="text-center">Unit Price</div>,
      dataIndex: "price",
      key: "price",
      render: (_text, record) => (
        <div className="text-center">
          {record?.discount
            ? record?.discount_type === "PERCENTAGE"
              ? record?.product_price -
                (record?.product_price * record?.discount) / 100
              : record?.product_price - record?.discount
            : record?.product_price}{" "}
        </div>
      ),
    },
    {
      title: <div className="text-right">Total</div>,
      dataIndex: "total",
      key: "total",
      render: (_text, record) => (
        <div className="text-right">{record?.total_price}</div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <Breadcrumb items={items} />

      <TitleWithButton title="Order Details" />
      <div className="sm:rounded-md sm:bg-white sm:p-6 sm:shadow lg:p-8">
        <div className="flex gap-5 max-md:flex-col md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-primary sm:text-lg">{`Order ID: #${order?.order_id}`}</h2>
            <p className="text-gray-700 max-sm:text-sm">{`${dayjs(order?.created_at).format("MMM DD, hh:mm A")}`}</p>
          </div>

          <div className="flex gap-5 xs:flex-col md:flex-row">
            <div className="w-full">
              <p className="text-sm text-gray-500">Payment status </p>
              <Select
                name="Payment Status"
                className="w-48 max-xs:w-full lg:w-60"
                options={paymentStatusOptions}
                value={paymentStatusOptions.find(
                  (item) => item.value === order?.payment?.status,
                )}
                placeholder="Select Order Status"
                onChange={(value) => {
                  handleUpdatePaymentStatus(value);
                }}
              />
            </div>

            <div className="w-full">
              <p className="text-sm text-gray-500">Order status </p>
              <Select
                name="Order Status"
                className="w-48 max-xs:w-full lg:w-60"
                options={orderStatusOptions}
                value={orderStatusOptions.find(
                  (item) => item.value === order?.status,
                )}
                placeholder="Select Order Status"
                onChange={(value) => {
                  handleUpdateOrderStatus(value);
                }}
              />
            </div>
          </div>
        </div>

        <div className="mb-5 mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {/* customer info */}
          <div className="flex items-start gap-4">
            <div
              className={`mt-1 w-fit rounded-full bg-gray-200 p-2 max-xs:hidden`}
            >
              <User size={32} className="text-primary-700 p-1" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">Customer</h3>
              <div>
                <div>
                  <p className="text-sm text-gray-500">
                    Name:{" "}
                    <span className="font-medium text-primary">
                      {order?.customer_name}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Email:{" "}
                    <span className="font-medium text-primary">
                      {order?.email}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Phone:{" "}
                    <span className="font-medium text-primary">
                      {order?.phone}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* order info  */}
          <div className="flex items-start gap-4">
            <div
              className={`mt-1 w-fit rounded-full bg-gray-200 p-2 max-xs:hidden`}
            >
              <ShoppingCart size={32} className="text-primary-700 p-1" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">Order Info</h3>
              <div>
                <div>
                  <p className="text-sm text-gray-500">
                    Payment method:{" "}
                    <span className="font-medium text-primary">
                      {formatText(order?.payment?.payment_method)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Platform:{" "}
                    <span className="font-medium text-primary">
                      {formatText(order?.platform)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    <span className="font-medium text-primary">
                      {formatText(order?.status)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* delivery address */}
          <div className="flex items-start gap-4">
            <div
              className={`mt-1 w-fit rounded-full bg-gray-200 p-2 max-xs:hidden`}
            >
              <Truck size={32} className="text-primary-700 p-1" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">
                Delivery Address
              </h3>
              <div>
                <div>
                  <p className="text-sm text-gray-500">
                    Address:{" "}
                    <span className="font-medium text-primary">
                      {order?.address_line}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Location:{" "}
                    <span className="font-medium text-primary">
                      {order?.is_inside_dhaka
                        ? "Inside Dhaka"
                        : "Outside Dhaka"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Note:{" "}
                    <span className="font-medium text-primary">
                      {order?.note || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* payment info */}
          <div className="flex items-start gap-4">
            <div
              className={`mt-1 w-fit rounded-full bg-gray-200 p-2 max-xs:hidden`}
            >
              <Wallet size={32} className="text-primary-700 p-1" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">
                Payment Info
              </h3>
              <div>
                <div>
                  <p className="text-sm text-gray-500">
                    Payment status:{" "}
                    <span className="font-medium text-primary">
                      {formatText(order?.payment?.status)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Last digits:{" "}
                    <span className="font-medium text-primary">
                      {order?.payment?.last_4_digit || "N/A"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Transection id:{" "}
                    <span className="font-medium text-primary">
                      {order?.payment?.transaction_id || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="my-4">
          <div>
            <p className="text-sm text-gray-500">Reference link: </p>
            <h5>
              {order?.reference_link ? (
                <Link
                  href={order.reference_link}
                  target="_blank"
                  className="w-fit text-sm font-medium text-primary hover:underline"
                >
                  {order.reference_link}
                </Link>
              ) : (
                <p className="text-sm">No reference link found.</p>
              )}
            </h5>
          </div>
        </div>

        <hr />

        <div className="my-4">
          <h3 className="text-lg font-semibold text-primary">Order items</h3>

          <div className="mt-2">
            <Table
              bordered
              dataSource={order?.products}
              columns={columns}
              pagination={false}
              scroll={{
                x: "max-content",
              }}
              rowKey={(record) => record.id}
            />
          </div>

          <div className="mt-4 text-right text-lg font-medium text-primary max-xs:text-sm">
            <div className="flex justify-end gap-2">
              <p>Subtotal:</p>
              <p className="w-40">{order?.subtotal} Tk.</p>
            </div>
            <div className="flex justify-end gap-2">
              <p>Shipping Charge:</p>
              <p className="w-40">{order?.delivery_charge} Tk.</p>
            </div>
            <div className="mt-2 flex justify-end gap-2 text-xl font-bold text-primary max-xs:text-lg">
              <p>Grand Total:</p>
              <p className="w-40">{order?.grand_total} Tk.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
