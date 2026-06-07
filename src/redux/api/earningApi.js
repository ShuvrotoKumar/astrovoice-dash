import { baseApi } from "./baseApi";

const earningApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEarning: builder.query({
      query: ({ year, page }) => ({
        url: "/payments/admin/earnings",
        method: "GET",
        params: {
          year,
          page,
        },
      }),
      providesTags: ["earning"],
    }),
    getTransactions: builder.query({
      query: ({ year, month }) => ({
        url: "/payments/admin/transactions",
        method: "GET",
        params: {
          year,
          month,
        },
      }),
      providesTags: ["earning"],
    }),
    getEarningByYear: builder.query({
      query: ({ year }) => ({
        url: "/payments/admin/earnings/yearly",
        method: "GET",
        params: {
          year,
        },
      }),
      providesTags: ["earning"],
    }),
  }),
});

export const { useGetEarningQuery, useGetTransactionsQuery, useGetEarningByYearQuery } = earningApi;

export default earningApi;
