import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.order],
    }),
    getOrderList: build.query({
      query: (query) => ({
        url: "/orders/admin",
        method: "GET",
        params: query,
      }),
      providesTags: [tagTypes.order],
    }),
    getSingleOrder: build.query({
      query: (id) => ({
        url: `/orders/${id}/admin`,
        method: "GET",
      }),
      providesTags: [tagTypes.order],
    }),
    updateOrderStatus: build.mutation({
      query: ({ orderId, data }) => ({
        url: `/orders/${orderId}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.order],
    }),
    updateOrderItemQuantity: build.mutation({
      query: ({ orderId, itemId, data }) => ({
        url: `/orders/${orderId}/order-item/${itemId}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.order],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderListQuery,
  useGetSingleOrderQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderItemQuantityMutation,
} = orderApi;
