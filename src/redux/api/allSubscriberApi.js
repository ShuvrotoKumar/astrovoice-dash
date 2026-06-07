import { baseApi } from "./baseApi";

export const allSubscriberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscriber: builder.query({
      query: (params) => ({
        url: "/subscription/pricing",
        method: "GET",
        params: {
          ...params,
        },
      }),
      providesTags: ["subscriber"],
    }),
    updateSubscriber: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subscription/plan/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["subscriber"],
    }),
  }),
});

export const { useGetAllSubscriberQuery } = allSubscriberApi;
export const { useUpdateSubscriberMutation } = allSubscriberApi;