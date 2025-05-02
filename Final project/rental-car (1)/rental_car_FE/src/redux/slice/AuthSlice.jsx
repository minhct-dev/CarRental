import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    login: false,
    profile: null
}

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LOGIN: (state, action) =>{
        state.profile = action.payload
        state.login = true
    },
    LOGOUT : (state) => {
      state.login = false;
      state.profile = null
      console.log("logout");
      
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    },
  }
});

export const {LOGIN, LOGOUT} = AuthSlice.actions

export default AuthSlice.reducer