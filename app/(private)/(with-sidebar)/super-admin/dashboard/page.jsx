"use client";

import {
  useGetCustomerAnalyticsQuery,
  useGetOrderAnalyticsQuery,
  useGetSalesAnalyticsQuery,
} from "@/redux/api/dashboardApi";
import { Column } from "@ant-design/plots";
import { Pie } from "@ant-design/plots";
import { Spin } from "antd";

export default function Dashboard() {
  const { data: salesData, isLoading: salesLoading } =
    useGetSalesAnalyticsQuery(
      {},
      {
        refetchOnMountOrArgChange: true,
      },
    );
  const { data: customerData, isLoading: customerLoading } =
    useGetCustomerAnalyticsQuery(
      {},
      {
        refetchOnMountOrArgChange: true,
      },
    );
  const { data: orderData, isLoading: orderLoading } =
    useGetOrderAnalyticsQuery(
      {},
      {
        refetchOnMountOrArgChange: true,
      },
    );

  const salesChartConfig = {
    data: salesData?.data?.sales || [],
    xField: "Month",
    yField: "Sales",
    label: {
      style: { fill: "#FFF", fontWeight: 600, fontSize: 16, opacity: 100 },
    },
    style: { fill: "#18181b" },
  };

  const customerConfig = {
    data: customerData?.data?.customer_analytics || [],
    angleField: "value",
    colorField: "type",
    style: {
      fill: (d) => d.color,
    },
    innerRadius: 0.6,
    label: {
      text: (text) => {
        return `${text.type}\n${text.value}`;
      },
      style: { fontWeight: "bold", opacity: 100 },
    },
    annotations: [
      {
        type: "text",
        style: {
          text: `Customers\n${customerData?.data?.total_customers}`,
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 20,
          fontStyle: "bold",
        },
        tooltip: false,
      },
    ],
    legend: false,
    tooltip: false,
  };

  const orderConfig = {
    data: orderData?.data?.order_analytics || [],
    angleField: "value",
    colorField: "type",
    style: {
      fill: (d) => d.color,
    },
    innerRadius: 0.6,
    label: {
      text: (text) => {
        return `${text.type}\n${text.value}`;
      },
      style: { fontWeight: "bold", opacity: 100 },
    },
    annotations: [
      {
        type: "text",
        style: {
          text: `Orders\n${orderData?.data?.total_orders}`,
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 20,
          fontStyle: "bold",
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        tooltip: false,
      },
    ],
    legend: false,
    tooltip: false,
  };

  return (
    <Spin spinning={salesLoading || customerLoading || orderLoading}>
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <div className="w-full bg-white xs:rounded-lg xs:p-4 xs:shadow">
            <h3 className="mb-4 text-3xl font-semibold">Customer Overview</h3>
            <div className="flex w-full items-center justify-center">
              <div className="max-w-[290px] xl:max-w-[450px]">
                <Pie {...customerConfig} />
              </div>
            </div>
          </div>
          <div className="w-full bg-white xs:rounded-lg xs:p-4 xs:shadow">
            <h3 className="mb-4 text-3xl font-semibold">Order Overview</h3>
            <div className="flex w-full items-center justify-center">
              <div className="max-w-[290px] xl:max-w-[450px]">
                <Pie {...orderConfig} />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white xs:rounded-lg xs:p-4 xs:shadow">
          <h3 className="mb-4 text-3xl font-semibold">Monthly Sales</h3>
          <Column {...salesChartConfig} />
        </div>
      </div>
    </Spin>
  );
}
