import { baseApi } from "./baseApi";

const termsAndConditionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTermsAndConditions: builder.query({
      query: () => ({
        url: "legal-docs/terms-conditions",
        method: "GET",
      }),
      providesTags: ["termsAndConditions"],
    }),
    updateTermsAndConditions: builder.mutation({
      query: ({ requestData }) => ({
        url: "legal-docs/terms-conditions",
        method: "PATCH",
        body: requestData,
      }),
      invalidatesTags: ["termsAndConditions"],
    }),
    aboutUs: builder.mutation({
      query: ({ requestData }) => ({
        url: "legal-docs/about-us",
        method: "PATCH",
        body: requestData,
      }),
      invalidatesTags: ["aboutUs"],
    }),
  }),
});

export const {
  useGetTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation,
  useAboutUsMutation,
} = termsAndConditionsApi;
