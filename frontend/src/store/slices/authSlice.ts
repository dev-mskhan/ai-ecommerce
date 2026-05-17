import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "@store/api/authApi";
import { userApi } from "@store/api/userApi";
interface AuthState {
    user: Object | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = { user: null, isAuthenticated: false, };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            authApi.endpoints.login.matchFulfilled,
            (state, { payload }: PayloadAction<{ user: Object }>) => {
                state.user = payload;
                state.isAuthenticated = true;
            }
        );
        builder.addMatcher(
            authApi.endpoints.verifyEmail.matchFulfilled,
            (state, { payload }: PayloadAction<{ user: Object }>) => {
                state.user = payload;
                state.isAuthenticated = true;
            }
        );
        builder.addMatcher(
            authApi.endpoints.logout.matchFulfilled,
            (state) => {
                state.user = null;
                state.isAuthenticated = false;
            }
        );
        builder.addMatcher(
            userApi.endpoints.getCurrentUser.matchFulfilled,
            (state, { payload }: PayloadAction<{ user: Object }>) => {
                state.user = payload;
                state.isAuthenticated = true;
            }
        );
    },
});


export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export default authSlice.reducer;