import { useAppSelector } from "@store/index";
import {
    selectCurrentUser,
} from "@store/slices/authSlice";
import {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useRefreshTokenMutation,
    useVerifyEmailMutation,
} from "@api/authApi";

export const useAuth = () => {
    const user = useAppSelector(selectCurrentUser);
    const isAuthenticated = user != null;
    const role = (user as { role: string })?.role;
    const isAdmin = role === "admin";
    const isVendor = role === "vendor";
    const isBuyer = role === "buyer";

    const [login, loginState] = useLoginMutation();
    const [register, registerState] = useRegisterMutation();
    const [logout, logoutState] = useLogoutMutation();
    const [forgotPassword, forgotState] = useForgotPasswordMutation();
    const [resetPassword, resetState] = useResetPasswordMutation();
    const [refreshToken, refreshState] = useRefreshTokenMutation();
    const [verifyEmail, verifyState] = useVerifyEmailMutation();

    return {
        user,
        isAuthenticated, isAdmin, isVendor, isBuyer,
        login, loginState,
        register, registerState,
        logout, logoutState,
        forgotPassword, forgotState,
        resetPassword, resetState,
        refreshToken, refreshState,
        verifyEmail, verifyState,
    };
};