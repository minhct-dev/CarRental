import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    client : null
}

const stompsClient = createSlice({
  name: "socket",
  initialState,
  reducers: {
    SET_CLIENT_SOCKET : (state, action) => {
        state.client = action.payload
    }
  }
});

export const {SET_CLIENT_SOCKET} = stompsClient.actions

export default stompsClient.reducer