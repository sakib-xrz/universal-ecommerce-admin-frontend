import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query({
      query: () => ({
        url: "/profile/me",
        method: "GET",
      }),
      providesTags: [tagTypes.profile],
    }),
    updateProfilePicture: build.mutation({
      query: (data) => ({
        url: "/profile/image",
        method: "PATCH",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: [tagTypes.profile],
    }),
    updateProfile: build.mutation({
      query: (data) => ({
        url: "/profile",
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.profile],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfilePictureMutation,
  useUpdateProfileMutation,
} = profileApi;
