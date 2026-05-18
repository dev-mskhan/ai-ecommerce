import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

const BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3000") + "/api/v1";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
});

export const authBaseQuery = fetchBaseQuery({
    baseUrl: `${BASE_URL}/auth`,
    credentials: "include",
});

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await rawBaseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
        const refreshResult = await rawBaseQuery(
            { url: "/auth/refresh-access-token", method: "POST" },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            result = await rawBaseQuery(args, api, extraOptions);
        }
    }

    return result;
};