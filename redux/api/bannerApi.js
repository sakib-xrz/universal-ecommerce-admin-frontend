import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const bannerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBanners: build.query({
      query: () => ({
        url: "/banners",
        method: "GET",
      }),
      providesTags: [tagTypes.banner],
    }),
    createBanner: build.mutation({
      query: (data) => ({
        url: "/banners",
        method: "POST",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        formData: true,
      }),
      invalidatesTags: [tagTypes.banner],
    }),
    updateBanner: build.mutation({
      query: ({ id, data }) => ({
        url: `/banners/${id}`,
        method: "PUT",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        formData: true,
      }),
      invalidatesTags: [tagTypes.banner],
    }),
    deleteBanner: build.mutation({
      query: (id) => ({
        url: `/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.banner],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
