import {
    useGetCurrentUserQuery,
    useUpdateUserMutation,
    useDeleteAccountMutation,
} from "@api/userApi";

export const useCurrentUser = () => useGetCurrentUserQuery();

export const useUserActions = () => ({
    update: useUpdateUserMutation(),
    deleteAccount: useDeleteAccountMutation(),
});