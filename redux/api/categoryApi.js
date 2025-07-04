import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: [tagTypes.category],
    }),
    getCategoriesList: build.query({
      query: () => ({
        url: "/categories/list",
        method: "GET",
      }),
      providesTags: [tagTypes.category],
    }),
    createCategory: build.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: [tagTypes.category],
    }),
    changeCategoryStatus: build.mutation({
      query: (id) => ({
        url: `/categories/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.category],
    }),
    updateCategory: build.mutation({
      query: ({ id, payload }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        data: payload,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: [tagTypes.category],
    }),
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.category],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoriesListQuery,
  useCreateCategoryMutation,
  useChangeCategoryStatusMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
