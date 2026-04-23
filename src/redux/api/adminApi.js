import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdmin: builder.query({
      query: (params) => ({
        url: "/admin/all-admins",
        method: "GET",
        params: {
          ...params,
        },
      }),
      providesTags: ["admin"],
    }),
    editAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/edit-admin",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["admin"],
    }),
    me: builder.query({
      query: () => ({
        url: "/admin/me",
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    avatar: builder.mutation({
      query: (data) => ({
        url: "/admin/update-avatar",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["admin"],
    }),
  }),
});

export const { useGetAllAdminQuery, useEditAdminMutation, useMeQuery, useAvatarMutation } = adminApi;
