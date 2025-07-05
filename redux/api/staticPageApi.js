import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export const staticPageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStaticPages: build.query({
      query: () => ({
        url: "/static-pages",
        method: "GET",
      }),
      providesTags: [tagTypes.staticPage],
    }),
    getStaticPage: build.query({
      query: (id) => ({
        url: `/static-pages/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.staticPage],
    }),
    getStaticPageByKind: build.query({
      query: (kind) => ({
        url: `/static-pages/kind/${kind}`,
        method: "GET",
      }),
      providesTags: [tagTypes.staticPage],
    }),
    createStaticPage: build.mutation({
      query: (data) => ({
        url: "/static-pages",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.staticPage],
    }),
    updateStaticPage: build.mutation({
      query: ({ id, payload }) => ({
        url: `/static-pages/${id}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: [tagTypes.staticPage],
    }),
    deleteStaticPage: build.mutation({
      query: (id) => ({
        url: `/static-pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.staticPage],
    }),
  }),
});

export const {
  useGetStaticPagesQuery,
  useGetStaticPageQuery,
  useGetStaticPageByKindQuery,
  useCreateStaticPageMutation,
  useUpdateStaticPageMutation,
  useDeleteStaticPageMutation,
} = staticPageApi;
