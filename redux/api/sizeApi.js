import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export const sizeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSizes: build.query({
      query: () => ({
        url: "/sizes",
        method: "GET",
      }),
      providesTags: [tagTypes.size],
    }),
    createSize: build.mutation({
      query: (data) => ({
        url: "/sizes",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.size],
    }),
    deleteSize: build.mutation({
      query: (id) => ({
        url: `/sizes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.size],
    }),
  }),
});

export const {
  useGetSizesQuery,
  useCreateSizeMutation,
  useDeleteSizeMutation,
} = sizeApi;
