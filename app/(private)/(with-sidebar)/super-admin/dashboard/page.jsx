"use client";

import {
  useGetCustomerAnalyticsQuery,
  useGetOrderAnalyticsQuery,
  useGetSalesAnalyticsQuery,
  useGetDashboardStatsQuery,
  useGetInventoryInsightsQuery,
  useGetTopPerformingProductsQuery,
  useGetProfitAnalysisQuery,
  useGetRecentActivityQuery,
} from "@/redux/api/dashboardApi";
import {
  Spin,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Progress,
  Table,
  List,
  Avatar,
  Badge,
  Tabs,
  Space,
  Divider,
  Empty,
  Button,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  ProductOutlined,
  AppstoreOutlined,
  TrophyOutlined,
  WarningOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  TeamOutlined,
  LineChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  NotificationOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
  PhoneOutlined,
  FacebookOutlined,
  InstagramOutlined,
  WhatsAppOutlined,
  PlusOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  SettingOutlined,
  FileTextOutlined,
  BankOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { TabPane } = Tabs;

export default function Dashboard() {
  const router = useRouter();

  const { data: salesData, isLoading: salesLoading } =
    useGetSalesAnalyticsQuery({}, { refetchOnMountOrArgChange: true });

  const { data: customerData, isLoading: customerLoading } =
    useGetCustomerAnalyticsQuery({}, { refetchOnMountOrArgChange: true });

  const { data: orderData, isLoading: orderLoading } =
    useGetOrderAnalyticsQuery({}, { refetchOnMountOrArgChange: true });

  const { data: statsData, isLoading: statsLoading } =
    useGetDashboardStatsQuery({}, { refetchOnMountOrArgChange: true });

  const { data: inventoryData, isLoading: inventoryLoading } =
    useGetInventoryInsightsQuery({}, { refetchOnMountOrArgChange: true });

  const { data: topProductsData, isLoading: topProductsLoading } =
    useGetTopPerformingProductsQuery({}, { refetchOnMountOrArgChange: true });

  const { data: profitData, isLoading: profitLoading } =
    useGetProfitAnalysisQuery({}, { refetchOnMountOrArgChange: true });

  const { data: recentActivityData, isLoading: recentActivityLoading } =
    useGetRecentActivityQuery({}, { refetchOnMountOrArgChange: true });

  const isLoading =
    salesLoading ||
    customerLoading ||
    orderLoading ||
    statsLoading ||
    inventoryLoading ||
    topProductsLoading ||
    profitLoading ||
    recentActivityLoading;

  // Quick action items for navigation
  const quickActionItems = [
    {
      title: "Add Product",
      icon: <PlusOutlined />,
      href: "/super-admin/product/add",
      description: "Create new product",
      color: "#1890ff",
    },
    {
      title: "Create Order",
      icon: <ShoppingOutlined />,
      href: "/super-admin/order/add",
      description: "New order entry",
      color: "#52c41a",
    },
    {
      title: "Manage Users",
      icon: <UserOutlined />,
      href: "/super-admin/user",
      description: "User management",
      color: "#722ed1",
    },
    {
      title: "Add Category",
      icon: <AppstoreOutlined />,
      href: "/super-admin/category/add",
      description: "Create category",
      color: "#fa8c16",
    },
    {
      title: "View Orders",
      icon: <EyeOutlined />,
      href: "/super-admin/order",
      description: "Order management",
      color: "#13c2c2",
    },
    {
      title: "Settings",
      icon: <SettingOutlined />,
      href: "/super-admin/setting",
      description: "System settings",
      color: "#eb2f96",
    },
  ];

  const getOrderStatusColor = (status) => {
    const colors = {
      PLACED: "#808080",
      CONFIRMED: "#9ACD32",
      SHIPPED: "#007BFF",
      PENDING: "#FFD700",
      DELIVERED: "#28A745",
      CANCELLED: "#DC3545",
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Low stock products table columns
  const inventoryColumns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product) => (
        <div>
          <div className="font-medium">{product.name}</div>
          <div className="text-sm text-gray-500">SKU: {product.sku}</div>
        </div>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (size) => size?.name || "N/A",
      align: "center",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => (
        <Badge
          count={stock}
          style={{
            backgroundColor:
              stock === 0 ? "#DC3545" : stock < 5 ? "#FFD700" : "#28A745",
          }}
        />
      ),
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link href={`/super-admin/product/edit/${record.product.id}`}>
          <Button type="link" size="small" icon={<EditOutlined />}>
            Edit
          </Button>
        </Link>
      ),
      align: "center",
    },
  ];

  // Top products table columns
  const topProductsColumns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-gray-500">{record.category?.name}</div>
        </div>
      ),
    },
    {
      title: "Quantity Sold",
      dataIndex: "total_quantity_sold",
      key: "quantity",
      render: (quantity) => (
        <Badge count={quantity} style={{ backgroundColor: "#1890ff" }} />
      ),
      align: "center",
    },
    {
      title: "Revenue",
      dataIndex: "total_revenue",
      key: "revenue",
      render: (revenue) => formatCurrency(revenue),
      align: "center",
    },
    {
      title: "Orders",
      dataIndex: "total_orders",
      key: "orders",
      render: (orders) => (
        <Badge count={orders} style={{ backgroundColor: "#52c41a" }} />
      ),
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link href={`/super-admin/product?search=${record.sku}`}>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            View
          </Button>
        </Link>
      ),
      align: "center",
    },
  ];

  return (
    <Spin spinning={isLoading}>
      <div className="space-y-6">
        {/* Quick Action Cards */}
        <Card title="Quick Actions" className="mb-6">
          <Row gutter={[16, 16]}>
            {quickActionItems.map((item, index) => (
              <Col xs={24} sm={12} md={8} lg={4} key={index}>
                <Link href={item.href}>
                  <Card
                    hoverable
                    className="text-center transition-all hover:shadow-lg"
                    bodyStyle={{ padding: "16px" }}
                  >
                    <div
                      className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: `${item.color}15`,
                        color: item.color,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-500">
                      {item.description}
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Key Performance Indicators with Navigation */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
              <Link href="/super-admin/order">
                <Statistic
                  title="Monthly Revenue"
                  value={formatCurrency(
                    statsData?.data?.current_month_revenue || 0,
                  )}
                  prefix={<DollarOutlined className="text-green-500" />}
                  suffix={
                    <div className="text-sm">
                      {
                        formatGrowthPercentage(
                          statsData?.data?.revenue_growth || 0,
                        ).icon
                      }
                      <span
                        style={{
                          color: formatGrowthPercentage(
                            statsData?.data?.revenue_growth || 0,
                          ).color,
                        }}
                      >
                        {
                          formatGrowthPercentage(
                            statsData?.data?.revenue_growth || 0,
                          ).text
                        }
                      </span>
                    </div>
                  }
                  valueStyle={{ color: "#389e0d" }}
                />
                <div className="mt-2 flex items-center text-xs text-gray-400">
                  Click to view orders <RightOutlined className="ml-1" />
                </div>
              </Link>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
              <Link href="/super-admin/order">
                <Statistic
                  title="Monthly Orders"
                  value={statsData?.data?.current_month_orders || 0}
                  prefix={<ShoppingOutlined className="text-blue-500" />}
                  suffix={
                    <div className="text-sm">
                      {
                        formatGrowthPercentage(
                          statsData?.data?.order_growth || 0,
                        ).icon
                      }
                      <span
                        style={{
                          color: formatGrowthPercentage(
                            statsData?.data?.order_growth || 0,
                          ).color,
                        }}
                      >
                        {
                          formatGrowthPercentage(
                            statsData?.data?.order_growth || 0,
                          ).text
                        }
                      </span>
                    </div>
                  }
                  valueStyle={{ color: "#1890ff" }}
                />
                <div className="mt-2 flex items-center text-xs text-gray-400">
                  Click to manage orders <RightOutlined className="ml-1" />
                </div>
              </Link>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full">
              <Statistic
                title="Monthly Profit"
                value={formatCurrency(profitData?.data?.monthly_profit || 0)}
                prefix={<TrophyOutlined className="text-purple-500" />}
                suffix={
                  <div className="text-sm">
                    Margin:{" "}
                    {profitData?.data?.monthly_profit_margin?.toFixed(1) || 0}%
                  </div>
                }
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full">
              <Statistic
                title="Average Order Value"
                value={formatCurrency(
                  statsData?.data?.average_order_value || 0,
                )}
                prefix={<BarChartOutlined className="text-orange-500" />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Business Overview with Navigation */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card className="h-full">
              <Statistic
                title="Total Lifetime Revenue"
                value={formatCurrency(
                  statsData?.data?.total_lifetime_revenue || 0,
                )}
                prefix={<LineChartOutlined className="text-green-600" />}
                valueStyle={{ color: "#389e0d" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
              <Link href="/super-admin/product">
                <Statistic
                  title="Stock Value"
                  value={formatCurrency(
                    inventoryData?.data?.total_stock_value || 0,
                  )}
                  prefix={<ProductOutlined className="text-purple-500" />}
                  valueStyle={{ color: "#722ed1" }}
                />
                <div className="mt-2 flex items-center text-xs text-gray-400">
                  Click to manage products <RightOutlined className="ml-1" />
                </div>
              </Link>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
              <Link href="/super-admin/user">
                <Statistic
                  title="Recent Customers"
                  value={statsData?.data?.recent_customers || 0}
                  prefix={<UserOutlined className="text-blue-500" />}
                  valueStyle={{ color: "#1890ff" }}
                />
                <div className="mt-2 flex items-center text-xs text-gray-400">
                  Click to manage users <RightOutlined className="ml-1" />
                </div>
              </Link>
            </Card>
          </Col>
        </Row>

        {/* Main Dashboard Content */}
        <Tabs defaultActiveKey="1" type="card">
          <TabPane
            tab={
              <span>
                <PieChartOutlined />
                Analytics
              </span>
            }
            key="1"
          >
            <Row gutter={[16, 16]}>
              {/* Customer Analytics */}
              <Col xs={24} lg={8}>
                <Card
                  title="Customer Overview"
                  className="h-full"
                  extra={
                    <Link href="/super-admin/user">
                      <Button type="text" size="small">
                        View All <RightOutlined />
                      </Button>
                    </Link>
                  }
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        Total Customers
                      </span>
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
                              <span className="font-medium">
                                {customer.type}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-semibold">
                                {customer.value}
                              </span>
                              <Tag color={customer.color}>
                                {(
                                  (customer.value /
                                    (customerData?.data?.total_customers ||
                                      1)) *
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

              {/* Order Analytics */}
              <Col xs={24} lg={8}>
                <Card
                  title="Order Overview"
                  className="h-full"
                  extra={
                    <Link href="/super-admin/order">
                      <Button type="text" size="small">
                        View All <RightOutlined />
                      </Button>
                    </Link>
                  }
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        Total Orders
                      </span>
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

              {/* Profit Analysis */}
              <Col xs={24} lg={8}>
                <Card title="Profit Analysis" className="h-full">
                  <div className="space-y-4">
                    <div className="text-center">
                      <Progress
                        type="circle"
                        percent={profitData?.data?.profit_margin || 0}
                        format={() =>
                          `${(profitData?.data?.profit_margin || 0).toFixed(1)}%`
                        }
                        strokeColor="#52c41a"
                        size={120}
                      />
                      <div className="mt-2 text-sm text-gray-500">
                        Profit Margin
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(profitData?.data?.total_profit || 0)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Total Profit
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {formatCurrency(profitData?.data?.total_revenue || 0)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Total Revenue
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                Products
              </span>
            }
            key="2"
          >
            <Row gutter={[16, 16]}>
              {/* Top Selling Products */}
              <Col xs={24} lg={12}>
                <Card
                  title="Top Selling Products"
                  className="h-full"
                  extra={
                    <Link href="/super-admin/product">
                      <Button type="text" size="small">
                        View All <RightOutlined />
                      </Button>
                    </Link>
                  }
                >
                  <Table
                    dataSource={
                      topProductsData?.data?.top_selling_products || []
                    }
                    columns={topProductsColumns}
                    pagination={false}
                    size="small"
                    rowKey="sku"
                  />
                </Card>
              </Col>

              {/* Inventory Alerts */}
              <Col xs={24} lg={12}>
                <Card
                  title="Low Stock Alert"
                  className="h-full"
                  extra={
                    <Space>
                      <Badge
                        count={inventoryData?.data?.low_stock_alerts || 0}
                        style={{ backgroundColor: "#f5222d" }}
                      />
                      <Link href="/super-admin/product">
                        <Button type="text" size="small">
                          Manage <RightOutlined />
                        </Button>
                      </Link>
                    </Space>
                  }
                >
                  {inventoryData?.data?.low_stock_products?.length > 0 ? (
                    <Table
                      dataSource={inventoryData?.data?.low_stock_products || []}
                      columns={inventoryColumns}
                      pagination={false}
                      size="small"
                      rowKey="id"
                    />
                  ) : (
                    <Empty description="No low stock products" />
                  )}
                </Card>
              </Col>
            </Row>

            {/* Inventory Overview */}
            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24} sm={8}>
                <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                  <Link href="/super-admin/product">
                    <Statistic
                      title="Total Products"
                      value={statsData?.data?.total_products || 0}
                      prefix={<ProductOutlined className="text-purple-500" />}
                      valueStyle={{ color: "#722ed1" }}
                    />
                    <div className="mt-2 flex items-center text-xs text-gray-400">
                      Click to manage <RightOutlined className="ml-1" />
                    </div>
                  </Link>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                  <Link href="/super-admin/product">
                    <Statistic
                      title="Out of Stock"
                      value={inventoryData?.data?.out_of_stock_count || 0}
                      prefix={
                        <ExclamationCircleOutlined className="text-red-500" />
                      }
                      valueStyle={{ color: "#f5222d" }}
                    />
                    <div className="mt-2 flex items-center text-xs text-gray-400">
                      Click to restock <RightOutlined className="ml-1" />
                    </div>
                  </Link>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                  <Link href="/super-admin/category">
                    <Statistic
                      title="Categories"
                      value={statsData?.data?.total_categories || 0}
                      prefix={<AppstoreOutlined className="text-cyan-500" />}
                      valueStyle={{ color: "#13c2c2" }}
                    />
                    <div className="mt-2 flex items-center text-xs text-gray-400">
                      Click to manage <RightOutlined className="ml-1" />
                    </div>
                  </Link>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <LineChartOutlined />
                Sales
              </span>
            }
            key="3"
          >
            {/* Monthly Sales Overview */}
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
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(sale.Revenue)}
                        </div>
                        <div className="text-sm font-medium text-blue-600">
                          {sale.Orders} orders
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Spin>
  );
}
