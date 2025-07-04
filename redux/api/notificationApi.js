import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotificationList: build.query({
      query: (query) => ({
        url: "/notifications",
        method: "GET",
        params: query,
      }),
      providesTags: [tagTypes.notification],
    }),
    getNotificationStats: build.query({
      query: () => ({
        url: "/notifications/stats",
        method: "GET",
      }),
      providesTags: [tagTypes.notification],
    }),
    readNotification: build.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.notification],
    }),
    readAllNotifications: build.mutation({
      query: () => ({
        url: "/notifications/read",
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.notification],
    }),
  }),
});

export const {
  useGetNotificationListQuery,
  useGetNotificationStatsQuery,
  useReadNotificationMutation,
  useReadAllNotificationsMutation,
} = notificationApi;
