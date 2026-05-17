import { createApi } from "@reduxjs/toolkit/query/react";
import { authBaseQuery } from "@store/baseQuery";
import { userApi } from "./userApi";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: authBaseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<{ user: Record<string, unknown> }, { email: string; password: string }>({
            query: (body) => ({ url: "/login", method: "POST", body })
        }),

        register: builder.mutation<{ message: string }, { name: string; email: string; password: string }>({
            query: (body) => ({ url: "/register", method: "POST", body })
        }),

        logout: builder.mutation<{ message: string }, void>({
            query: () => ({ url: "/logout", method: "POST" })
        }),

        refreshToken: builder.mutation<{ message: string }, void>({
            query: () => ({ url: "/refresh-access-token", method: "POST" }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await queryFulfilled;
                dispatch(userApi.util.invalidateTags(["current"]))
            }
        }),

        forgotPassword: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({ url: "/forgot-password", method: "POST", body })
        }),

        resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
            query: ({ token, ...body }) => ({ url: `/reset-password/${token}`, method: "POST", body }),
        }),
        verifyEmail: builder.mutation<{ user: Record<string, unknown> }, { token: string }>({
            query: ({ token }) => ({ url: `/verify-email/${token}`, method: "POST" }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useRefreshTokenMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyEmailMutation
} = authApi;