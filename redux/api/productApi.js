import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProductList: build.query({
      query: (query) => ({
        url: "/products/admin",
        method: "GET",
        params: query,
      }),
      providesTags: [tagTypes.product],
    }),
    getSingleProduct: build.query({
      query: (id) => ({
        url: `/products/${id}/admin`,
        method: "GET",
      }),
      providesTags: [tagTypes.product],
    }),
    createProduct: build.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.product],
    }),
    updateProduct: build.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.product],
    }),
    updatePublishStatus: build.mutation({
      query: (id) => ({
        url: `/products/${id}/publish-status`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.product],
    }),
    deleteProduct: build.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.product],
    }),
  }),
});

export const {
  useGetProductListQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdatePublishStatusMutation,
  useDeleteProductMutation,
} = productApi;
