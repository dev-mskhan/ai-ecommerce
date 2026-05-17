import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@store/baseQuery";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery,
    tagTypes: ["current"],
    endpoints: (builder) => ({
        getCurrentUser: builder.query<{ user: Record<string, unknown> }, void>({
            query: () => "/users/me",
            providesTags: ["current"],
        }),

        updateUser: builder.mutation<{ user: Record<string, unknown> }, FormData>({
            query: (body) => ({ url: "/users/me", method: "PATCH", body }),
            invalidatesTags: ["current"],
        }),

        deleteAccount: builder.mutation<void, void>({
            query: () => ({ url: "/users/me", method: "DELETE" }),
        }),
    }),
});


export const {
    useGetCurrentUserQuery,
    useUpdateUserMutation,
    useDeleteAccountMutation,
} = userApi;