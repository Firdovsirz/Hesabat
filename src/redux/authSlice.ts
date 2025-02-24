import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    role: string | null;
    username: string | null;
}

const initialState: AuthState = {
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    role: typeof window !== "undefined" ? localStorage.getItem("role") : null,
    username: typeof window !== "undefined" ? localStorage.getItem("username") : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state: AuthState, action: PayloadAction<{ token: string; role: string; username: string }>) => {
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.username = action.payload.username;
            if (typeof window !== "undefined") {
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("role", action.payload.role);
                localStorage.setItem("username", action.payload.username);
            }
        },
        logout: (state: AuthState) => {
            state.token = null;
            state.role = null;
            state.username = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("username");
            }
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;