import { useAppDispatch } from "../index";
import { addToast, removeToast, clearToasts, type ToastType } from "@slices/toastSlice";

export const useToast = () => {
    const dispatch = useAppDispatch();

    const toast = (message: string, type: ToastType = "info", duration = 4000) => {
        dispatch(addToast({ message, type, duration }));
    };

    return {
        toast,
        success: (message: string, duration?: number) => toast(message, "success", duration),
        error: (message: string, duration?: number) => toast(message, "error", duration),
        warning: (message: string, duration?: number) => toast(message, "warning", duration),
        info: (message: string, duration?: number) => toast(message, "info", duration),
        dismiss: (id: string) => dispatch(removeToast(id)),
        clear: () => dispatch(clearToasts()),
    };
};