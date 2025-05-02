import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    email : null
}

const activeSlice = createSlice({
  name: "active",
  initialState,
  reducers: {
    SET_EMAIL_ACTIVE :(state,action)=>{
        state.email = action.payload
    },
    CLEAR_ACTIVE : (state)=>{
        state.email = null
    }
  }
});

export const {SET_EMAIL_ACTIVE,CLEAR_ACTIVE} = activeSlice.actions

export default activeSlice.reducer