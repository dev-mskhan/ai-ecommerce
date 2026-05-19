import { configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

import authReducer from "@slices/authSlice";
import { authApi } from "@api/authApi";
import { adminApi } from "@api/adminApi";
import { categoryApi } from "@api/categoryApi";
import { chatApi } from "@api/chatApi";
import { couponApi } from "@api/couponApi";
import { notificationApi } from "@api/notificationApi";
import { orderApi } from "@api/orderApi";
import { productApi } from "@api/productApi";
import { reviewApi } from "@api/reviewApi";
import { userApi } from "@api/userApi";
import { vendorApi } from "@api/vendorApi";
import { supportApi } from "./api/supportApi";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [supportApi.reducerPath]: supportApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [couponApi.reducerPath]: couponApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [vendorApi.reducerPath]: vendorApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            supportApi.middleware,
            authApi.middleware,
            adminApi.middleware,
            categoryApi.middleware,
            chatApi.middleware,
            couponApi.middleware,
            notificationApi.middleware,
            orderApi.middleware,
            productApi.middleware,
            reviewApi.middleware,
            userApi.middleware,
            vendorApi.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;