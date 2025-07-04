import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updatePaymentStatus: build.mutation({
      query: ({ orderId, data }) => ({
        url: `/payments/${orderId}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.payment, tagTypes.order],
    }),
  }),
});

export const { useUpdatePaymentStatusMutation } = paymentApi;
