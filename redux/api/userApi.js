import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    getAllUsers: build.query({
      query: (query) => ({
        url: "/users",
        method: "GET",
        params: query,
      }),
      providesTags: [tagTypes.user],
    }),
    updateUserStatus: build.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    deleteUser: build.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.user],
    }),
    getCustomerList: build.query({
      query: (query) => ({
        url: "/users/customers",
        method: "GET",
        params: query,
      }),
      providesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetCustomerListQuery,
} = userApi;
