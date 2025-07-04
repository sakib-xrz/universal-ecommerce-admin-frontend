import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export const productVariantApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProductVariant: build.mutation({
      query: (data) => ({
        url: "/product-variants",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.product],
    }),
    updateProductVariant: build.mutation({
      query: ({ id, data }) => ({
        url: `/product-variants/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.product],
    }),
    deleteProductVariant: build.mutation({
      query: (id) => ({
        url: `/product-variants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.product],
    }),
  }),
});

export const {
  useCreateProductVariantMutation,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
} = productVariantApi;
