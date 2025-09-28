import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export const pathaoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Authentication
    pathaoLogin: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
      }),
    }),

    // Location Services
    getPathaoCities: builder.query({
      query: () => ({
        url: "/pathao/cities",
        method: "GET",
      }),
      providesTags: ["PathaoCity"],
    }),

    getPathaoZones: builder.query({
      query: (cityId) => {
        console.log(cityId, "cityId");

        return {
          url: `/pathao/cities/${cityId}/zones`,
          method: "GET",
        };
      },
      providesTags: ["PathaoZone"],
    }),

    getPathaoAreas: builder.query({
      query: (zoneId) => ({
        url: `/pathao/zones/${zoneId}/areas`,
        method: "GET",
      }),
      providesTags: ["PathaoArea"],
    }),

    // Price & Store Services
    calculatePathaoPrice: builder.mutation({
      query: (priceData) => ({
        url: "/pathao/price/calculate",
        method: "POST",
        data: priceData,
      }),
    }),

    getPathaoStores: builder.query({
      query: () => ({
        url: "/pathao/stores",
        method: "GET",
      }),
      providesTags: ["PathaoStore"],
    }),

    // Order Management
    getPathaoOrders: builder.query({
      query: (params = {}) => ({
        url: "/pathao/orders",
        method: "GET",
        params,
      }),
      providesTags: ["PathaoOrder"],
    }),

    getPathaoOrderDetails: builder.query({
      query: (orderId) => ({
        url: `/pathao/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (result, error, orderId) => [
        { type: "PathaoOrder", id: orderId },
      ],
    }),

    updatePathaoOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/pathao/orders/${orderId}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "PathaoOrder", id: orderId },
        "PathaoOrder",
      ],
    }),

    getPathaoOrderByConsignment: builder.query({
      query: (consignmentId) => ({
        url: `/pathao/orders/info/${consignmentId}`,
        method: "GET",
      }),
      providesTags: (result, error, consignmentId) => [
        { type: "PathaoOrder", id: consignmentId },
      ],
    }),

    // Create Orders
    createPathaoOrder: builder.mutation({
      query: (orderData) => ({
        url: "/pathao/order",
        method: "POST",
        data: orderData,
      }),
      invalidatesTags: ["PathaoOrder"],
    }),

    createPathaoBulkOrders: builder.mutation({
      query: (ordersData) => ({
        url: "/pathao/orders/bulk",
        method: "POST",
        data: ordersData,
      }),
      invalidatesTags: ["PathaoOrder", tagTypes.order],
    }),
  }),
});

export const {
  usePathaoLoginMutation,
  useGetPathaoCitiesQuery,
  useGetPathaoZonesQuery,
  useGetPathaoAreasQuery,
  useCalculatePathaoPriceMutation,
  useGetPathaoStoresQuery,
  useGetPathaoOrdersQuery,
  useGetPathaoOrderDetailsQuery,
  useUpdatePathaoOrderStatusMutation,
  useGetPathaoOrderByConsignmentQuery,
  useCreatePathaoOrderMutation,
  useCreatePathaoBulkOrdersMutation,
} = pathaoApi;
