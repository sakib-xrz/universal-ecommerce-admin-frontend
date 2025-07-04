import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    changePassword: build.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        data,
      }),
      providesTags: [tagTypes.auth],
    }),
  }),
});

export const { useChangePasswordMutation } = authApi;
