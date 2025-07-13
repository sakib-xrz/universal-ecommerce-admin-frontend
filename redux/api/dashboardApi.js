import { baseApi } from "./baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomerAnalytics: build.query({
      query: () => ({
        url: "/dashboard/customer-analytics",
        method: "GET",
      }),
    }),
    getOrderAnalytics: build.query({
      query: () => ({
        url: "/dashboard/order-analytics",
        method: "GET",
      }),
    }),
    getSalesAnalytics: build.query({
      query: () => ({
        url: "/dashboard/sales-analytics",
        method: "GET",
      }),
    }),
    getDashboardStats: build.query({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
    }),
    getInventoryInsights: build.query({
      query: () => ({
        url: "/dashboard/inventory-insights",
        method: "GET",
      }),
    }),
    getTopPerformingProducts: build.query({
      query: () => ({
        url: "/dashboard/top-performing-products",
        method: "GET",
      }),
    }),
    getProfitAnalysis: build.query({
      query: () => ({
        url: "/dashboard/profit-analysis",
        method: "GET",
      }),
    }),
    getRecentActivity: build.query({
      query: () => ({
        url: "/dashboard/recent-activity",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCustomerAnalyticsQuery,
  useGetOrderAnalyticsQuery,
  useGetSalesAnalyticsQuery,
  useGetDashboardStatsQuery,
  useGetInventoryInsightsQuery,
  useGetTopPerformingProductsQuery,
  useGetProfitAnalysisQuery,
  useGetRecentActivityQuery,
} = dashboardApi;
