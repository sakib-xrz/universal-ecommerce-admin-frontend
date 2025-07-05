import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export const featuredCategoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFeaturedCategories: build.query({
      query: (params) => ({
        url: "/featured-categories",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.featuredCategory],
    }),
    getFeaturedCategory: build.query({
      query: (id) => ({
        url: `/featured-categories/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.featuredCategory],
    }),
    createFeaturedCategory: build.mutation({
      query: (data) => ({
        url: "/featured-categories",
        method: "POST",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: [tagTypes.featuredCategory],
    }),
    updateFeaturedCategory: build.mutation({
      query: ({ id, payload }) => ({
        url: `/featured-categories/${id}`,
        method: "PATCH",
        data: payload,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: [tagTypes.featuredCategory],
    }),
    deleteFeaturedCategory: build.mutation({
      query: (id) => ({
        url: `/featured-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.featuredCategory],
    }),
    toggleFeaturedCategoryStatus: build.mutation({
      query: (id) => ({
        url: `/featured-categories/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.featuredCategory],
    }),
    sortFeaturedCategories: build.mutation({
      query: (sortedIds) => ({
        url: "/featured-categories/sort",
        method: "PATCH",
        data: { sortedIds },
      }),
      invalidatesTags: [tagTypes.featuredCategory],
    }),
  }),
});

export const {
  useGetFeaturedCategoriesQuery,
  useGetFeaturedCategoryQuery,
  useCreateFeaturedCategoryMutation,
  useUpdateFeaturedCategoryMutation,
  useDeleteFeaturedCategoryMutation,
  useToggleFeaturedCategoryStatusMutation,
  useSortFeaturedCategoriesMutation,
} = featuredCategoryApi;
