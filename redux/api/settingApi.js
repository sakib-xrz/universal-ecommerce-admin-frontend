import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export const settingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSetting: build.query({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
      providesTags: [tagTypes.setting],
    }),
    createSetting: build.mutation({
      query: (data) => ({
        url: "/settings",
        method: "POST",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: [tagTypes.setting],
    }),
    updateSetting: build.mutation({
      query: ({ id, payload }) => ({
        url: `/settings/${id}`,
        method: "PATCH",
        data: payload,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: [tagTypes.setting],
    }),
    deleteSetting: build.mutation({
      query: (id) => ({
        url: `/settings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.setting],
    }),
  }),
});

export const {
  useGetSettingQuery,
  useCreateSettingMutation,
  useUpdateSettingMutation,
  useDeleteSettingMutation,
} = settingApi;
