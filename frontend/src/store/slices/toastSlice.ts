import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastState {
    toasts: Toast[];
}

const initialState: ToastState = { toasts: [] };

const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        addToast: {
            reducer(state, action: PayloadAction<Toast>) {
                state.toasts.push(action.payload);
            },
            prepare(payload: Omit<Toast, "id">) {
                return { payload: { ...payload, id: crypto.randomUUID() } };
            },
        },
        removeToast(state, action: PayloadAction<string>) {
            state.toasts = state.toasts.filter((t) => t.id !== action.payload);
        },
        clearToasts(state) {
            state.toasts = [];
        },
    },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;

export const selectToasts = (state: { toast: ToastState }) => state.toast.toasts;