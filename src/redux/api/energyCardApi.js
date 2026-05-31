import { baseApi } from "./baseApi";

export const energyCardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getEnergyCard: builder.query({
            query: () => "/payments/admin/energy-card/sales",
            method: "GET",
            providesTags: ["EnergyCard"],
        }),
        getEnergycardWishlist: builder.query({
            query: (page = 1) => `/wishlist/all?page=${page}&limit=10`,
            method: "GET",
            providesTags: ["EnergyCard"],
        }),
        getEnergycardWishlistStats: builder.query({
            query: () => "/wishlist/stats",
            method: "GET",
            providesTags: ["EnergyCard"],
        }),
    }),
});

export const { useGetEnergyCardQuery, useGetEnergycardWishlistQuery, useGetEnergycardWishlistStatsQuery } = energyCardApi;
