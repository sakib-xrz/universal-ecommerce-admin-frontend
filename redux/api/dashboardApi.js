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
  }),
});

export const {
  useGetCustomerAnalyticsQuery,
  useGetOrderAnalyticsQuery,
  useGetSalesAnalyticsQuery,
  useGetDashboardStatsQuery,
} = dashboardApi;
