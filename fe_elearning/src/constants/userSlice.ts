// 'use client'
import { Roles } from "@/types/userType";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: {
    username: "",
    profile_image: "",
    id: "",
    roles: <Roles[]>{},
    email: "",
    createdAt: "",
    first_name: "",
    last_name: "",
  },
};

const createUserSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload ?? state.userInfo;
    },
    clearUser: (state, action) => {
      state.userInfo = initialState.userInfo;
    },
  },
});

export const { setUser, clearUser } = createUserSlice.actions;
export default createUserSlice.reducer;
