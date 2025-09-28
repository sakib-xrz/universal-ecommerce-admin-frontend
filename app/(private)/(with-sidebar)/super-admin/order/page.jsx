"use client";

import TitleWithButton from "@/components/shared/title-with-button";
import {
  useGetOrderListQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/api/orderApi";
import { formatText, generateQueryString, sanitizeParams } from "@/utils";
import { Breadcrumb, Button, Pagination, Select, Table } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import OderSearchFilter from "./_components/order-search-filter";
import { orderStatusOptions, paymentStatusOptions } from "@/utils/constant";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useUpdatePaymentStatusMutation } from "@/redux/api/paymentApi";

const items = [
  {
    title: <Link href="/super-admin/dashboard">Dashboard</Link>,
  },
  {
    title: "Order",
  },
];

export default function Oder() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchKey, setSearchKey] = useState(searchParams.get("search") || "");

  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || null,
    payment_status: searchParams.get("payment_status") || null,
    is_inside_dhaka: searchParams.get("is_inside_dhaka") || null,
    platform: searchParams.get("platform") || null,
    sort_by: searchParams.get("sort_by") || "created_at",
    sort_order: searchParams.get("sort_order") || "desc",
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });

  const debouncedSearch = useDebouncedCallback((value) => {
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  }, 400);

  const updateURL = () => {
    const queryString = generateQueryString(params);
    router.push(`/super-admin/order${queryString}`, undefined, {
      shallow: true,
    });
  };

  const debouncedUpdateURL = useDebouncedCallback(updateURL, 500);

  useEffect(() => {
    debouncedUpdateURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchKey(value);
    debouncedSearch(value);
  };

  const handlePaginationChange = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

  const handleUpdateOrderStatus = async (orderId, status) => {
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

  const handleUpdatePaymentStatus = async (orderId, status) => {
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

  const { data, isLoading } = useGetOrderListQuery(sanitizeParams(params));

  const dataSource = data?.data || [];

  const columns = [
    {
      title: "Order Info",
      key: "order_id",
      render: (_text, record) => (
        <>
          <h3 className="font-semibold text-primary">#{record.order_id}</h3>
          <p className="text-xs text-gray-500">
            {dayjs(record.created_at).format("MMM DD, hh:mm A")}
          </p>
        </>
      ),
    },
    {
      title: "Customer Info",
      key: "customer",
      render: (_text, record) => (
        <div className="space-y-1">
          <h6 className="text-sm font-medium text-primary">
            {record.customer_name}
          </h6>
          <Link
            href={`tel:${record.phone}`}
            target="_blank"
            className="block w-fit text-sm font-medium text-primary hover:underline"
          >
            {record.phone}
          </Link>
        </div>
      ),
    },
    {
      title: "Delivery Address",
      key: "delivery_address",
      render: (_text, record) => (
        <h6
          className="line-clamp-2 max-w-64 text-sm font-medium text-primary"
          title={record.address_line}
        >
          {record.address_line}
        </h6>
      ),
      width: 250,
    },
    {
      title: <div className="text-center">Platform</div>,
      key: "platform",
      render: (_text, record) => (
        <h6 className="text-center text-sm font-medium text-primary">
          {formatText(record.platform)}
        </h6>
      ),
    },
    {
      title: <div className="text-center">Payment Method</div>,
      key: "payment_method",
      render: (_text, record) => (
        <div>
          <h6 className="text-center text-sm font-medium text-primary">
            {formatText(record.payment?.payment_method)}
          </h6>
          {record.payment?.payment_method !== "CASH_ON_DELIVERY" && (
            <div className="text-center text-xs font-medium text-gray-500">
              TXID: {record.payment?.transaction_id}, Last digits:{" "}
              {record?.payment?.last_4_digit}
            </div>
          )}
        </div>
      ),
      width: 280,
    },
    {
      title: <div className="text-center">Price</div>,
      key: "total_price",
      render: (_text, record) => (
        <h3 className="text-center font-semibold text-primary">
          {record.grand_total} Tk.
        </h3>
      ),
    },
    {
      title: <div className="text-center">Payment Status</div>,
      key: "payment_status",
      render: (_text, record) => (
        <div className="flex justify-center">
          <Select
            size="small"
            className="w-32"
            options={paymentStatusOptions}
            value={paymentStatusOptions.find(
              (item) => item.value === record.payment?.status,
            )}
            placeholder="Select Payment Status"
            onChange={(value) => {
              handleUpdatePaymentStatus(record.order_id, value);
            }}
          />
        </div>
      ),
    },
    {
      title: <div className="text-center">Order Status</div>,
      key: "order_status",
      render: (_text, record) => (
        <div className="flex justify-center">
          <Select
            size="small"
            name="Order Status"
            className="w-32"
            options={orderStatusOptions}
            value={orderStatusOptions.find(
              (item) => item.value === record?.status,
            )}
            placeholder="Select Order Status"
            onChange={(value) => {
              handleUpdateOrderStatus(record.order_id, value);
            }}
          />
        </div>
      ),
    },
    {
      title: <div className="text-center">Action</div>,
      key: "action",
      render: (_text, record) => (
        <div className="flex justify-center">
          <Link
            href={`/super-admin/order/${record.order_id}`}
            passHref
            className="cursor-pointer text-center text-info hover:underline"
          >
            Details
          </Link>
        </div>
      ),
    },
  ];

  const handleTableChange = (_pagination, _filters, sorter) => {
    const { order, columnKey } = sorter;

    setParams((prev) => ({
      ...prev,
      sort_by: columnKey || "created_at",
      sort_order:
        order === "ascend" ? "asc" : order === "descend" ? "desc" : "desc",
    }));
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={items} />
      <div className="space-y-5">
        <TitleWithButton
          title="Orders"
          buttonText="Create Order"
          href="/super-admin/order/add"
        />
      </div>
      <OderSearchFilter
        params={params}
        setParams={setParams}
        searchKey={searchKey}
        handleSearchChange={handleSearchChange}
        data={data}
      />

      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        loading={isLoading}
        pagination={false}
        scroll={{
          x: "max-content",
        }}
        // rowSelection={rowSelection}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
      />

      {!isLoading && (
        <Pagination
          current={params.page}
          onChange={handlePaginationChange}
          total={data.meta.total}
          pageSize={params.limit}
          align="center"
          showSizeChanger={true}
          onShowSizeChange={(current, size) =>
            setParams((prev) => ({ ...prev, limit: size, page: current }))
          }
          responsive={true}
        />
      )}
    </div>
  );
}
