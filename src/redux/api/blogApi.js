// import { baseApi } from "./baseApi";

// const blogApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getBlog: builder.query({
//       query: ({ year, page }) => ({
//         url: "/blogs",
//         method: "GET",
//         params: {
//           year,
//           page,
//         },
//       }),
//       providesTags: ["blog"],
//     }),
//     getSingleBlog: builder.query({
//       query: (id) => ({
//         url: `/blogs/${id}`,
//         method: "GET",
//       }),
//       providesTags: ["blog"],
//     }),
//   }),
//   createBlog: builder.mutation({
//       query: (data) => ({
//         url: "/blogs",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["blog"],
//     }),
//   });


// export const { useGetBlogQuery, useGetSingleBlogQuery, useCreateBlogMutation } = blogApi;

// export default blogApi;
