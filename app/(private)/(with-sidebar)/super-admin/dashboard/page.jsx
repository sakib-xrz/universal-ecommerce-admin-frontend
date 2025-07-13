"use client";

import {
  useGetCustomerAnalyticsQuery,
  useGetOrderAnalyticsQuery,
  useGetSalesAnalyticsQuery,
  useGetDashboardStatsQuery,
} from "@/redux/api/dashboardApi";
import { Spin, Card, Row, Col, Statistic, Tag } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  ProductOutlined,
  CalendarOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

export default function Dashboard() {
  const { data: salesData, isLoading: salesLoading } =
    useGetSalesAnalyticsQuery({}, { refetchOnMountOrArgChange: true });

  const { data: customerData, isLoading: customerLoading } =
    useGetCustomerAnalyticsQuery({}, { refetchOnMountOrArgChange: true });

  const { data: orderData, isLoading: orderLoading } =
    useGetOrderAnalyticsQuery({}, { refetchOnMountOrArgChange: true });

  const { data: statsData, isLoading: statsLoading } =
    useGetDashboardStatsQuery({}, { refetchOnMountOrArgChange: true });

  const isLoading =
    salesLoading || customerLoading || orderLoading || statsLoading;

  const getOrderStatusColor = (status) => {
    const colors = {
      Placed: "#808080",
      Confirmed: "#9ACD32",
      Shipped: "#007BFF",
      Pending: "#FFD700",
      Delivered: "#28A745",
      Cancelled: "#DC3545",
    };
    return colors[status] || "#000000";
  };

  const getCustomerStatusColor = (status) => {
    const colors = {
      Active: "#28A745",
      Inactive: "#DC3545",
    };
    return colors[status] || "#000000";
  };

  const formatGrowthPercentage = (growth) => {
    if (growth > 0) {
      return {
        icon: <ArrowUpOutlined style={{ color: "#28A745" }} />,
        text: `+${growth.toFixed(1)}%`,
        color: "#28A745",
      };
    } else if (growth < 0) {
      return {
        icon: <ArrowDownOutlined style={{ color: "#DC3545" }} />,
        text: `${growth.toFixed(1)}%`,
        color: "#DC3545",
      };
    } else {
      return {
        icon: null,
        text: "0%",
        color: "#808080",
      };
    }
  };

  const getCurrentMonthSales = () => {
    if (!salesData?.data?.sales) return 0;
    const currentMonth = new Date().toLocaleString("en-US", { month: "short" });
    const currentMonthData = salesData.data.sales.find(
      (item) => item.Month === currentMonth,
    );
    return currentMonthData ? currentMonthData.Sales : 0;
  };

  return (
    <Spin spinning={isLoading}>
      <div className="space-y-6">
        {/* Key Statistics Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full">
              <Statistic
                title="Current Month Orders"
                value={statsData?.data?.current_month_orders || 0}
                prefix={<ShoppingOutlined className="text-blue-500" />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full">
              <Statistic
                title="Last Month Orders"
                value={statsData?.data?.last_month_orders || 0}
                prefix={<CalendarOutlined className="text-orange-500" />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full">
              <div className="flex items-center justify-between">
                <Statistic
                  title="Order Growth"
                  value={Math.abs(statsData?.data?.order_growth || 0).toFixed(
                    1,
                  )}
                  suffix="%"
                  prefix={
                    formatGrowthPercentage(statsData?.data?.order_growth || 0)
                      .icon
                  }
                  valueStyle={{
                    color: formatGrowthPercentage(
                      statsData?.data?.order_growth || 0,
                    ).color,
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full">
              <Statistic
                title="Recent Customers"
                value={statsData?.data?.recent_customers || 0}
                prefix={<UserOutlined className="text-green-500" />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Business Overview */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card className="h-full">
              <Statistic
                title="Total Products"
                value={statsData?.data?.total_products || 0}
                prefix={<ProductOutlined className="text-purple-500" />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card className="h-full">
              <Statistic
                title="Total Categories"
                value={statsData?.data?.total_categories || 0}
                prefix={<AppstoreOutlined className="text-cyan-500" />}
                valueStyle={{ color: "#13c2c2" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card className="h-full">
              <Statistic
                title="Current Month Sales"
                value={getCurrentMonthSales()}
                prefix={<DollarOutlined className="text-green-600" />}
                valueStyle={{ color: "#389e0d" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Customer Analytics */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Customer Overview" className="h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total Customers</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {customerData?.data?.total_customers || 0}
                  </span>
                </div>
                <div className="space-y-3">
                  {customerData?.data?.customer_analytics?.map(
                    (customer, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: customer.color }}
                          />
                          <span className="font-medium">{customer.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold">
                            {customer.value}
                          </span>
                          <Tag color={getCustomerStatusColor(customer.type)}>
                            {(
                              (customer.value /
                                (customerData?.data?.total_customers || 1)) *
                              100
                            ).toFixed(1)}
                            %
                          </Tag>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Order Overview" className="h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total Orders</span>
                  <span className="text-2xl font-bold text-green-600">
                    {orderData?.data?.total_orders || 0}
                  </span>
                </div>
                <div className="space-y-3">
                  {orderData?.data?.order_analytics?.map((order, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: order.color }}
                        />
                        <span className="font-medium">{order.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold">
                          {order.value}
                        </span>
                        <Tag color={getOrderStatusColor(order.type)}>
                          {(
                            (order.value /
                              (orderData?.data?.total_orders || 1)) *
                            100
                          ).toFixed(1)}
                          %
                        </Tag>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Sales Analytics */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card title="Monthly Sales Overview" className="h-full">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12">
                {salesData?.data?.sales?.map((sale, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-gray-50 p-4 text-center"
                  >
                    <div className="mb-1 text-sm text-gray-600">
                      {sale.Month}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {sale.Sales}
                    </div>
                    <div className="text-xs text-gray-500">sales</div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
}
