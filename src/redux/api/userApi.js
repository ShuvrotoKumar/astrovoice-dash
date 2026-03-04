import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allUsers: builder.query({
      query: (params) => ({
        url: "/users/all",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
    recentUsers: builder.query({
      query: (params) => ({
        url: "/users/all?page=1&limit=5",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
    singleUser: builder.query({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    blockUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}/block`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
    unblockUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}/unblock`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
    allBlockedUsers: builder.query({
      query: () => ({
        url: "/users/blocked",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    totalUser: builder.query({
      query: () => ({
        url: `/users/total`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    searchUsers: builder.query({
      query: (params) => ({
        url: "/users/search",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
    userGrowth: builder.query({
      query: (params) => ({
        url: "/users/growth",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useAllUsersQuery,
  useSingleUserQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useAllBlockedUsersQuery,
  useDeleteUserMutation,
  useTotalUserQuery,
  useSearchUsersQuery,
  useRecentUsersQuery,
  useUserGrowthQuery,
} = userApi;
