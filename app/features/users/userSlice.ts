import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Auth } from "~/lib/types/auth";

interface initialStateType {
  authUser: Auth | null;
  token: string;
  loading: boolean;
}

const initialState: initialStateType = {
  authUser: null,
  token: "",
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<Auth>) => {
      state.authUser = action.payload;
    },
    addToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { addUser, setLoading, addToken } = userSlice.actions;

export default userSlice.reducer;
