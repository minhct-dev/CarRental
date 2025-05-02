import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    carOwner: null,
    chatRoom: null
}
const messageSlice = createSlice({
  name: "messagemessage",
  initialState,
  reducers: {
    SET_CHAT_ROOM : (state,action) => {
        state.chatRoom = action.payload.chatRoom,
        state.carOwner = action.payload.carOwner
    },
    CLEAR_CHAT: (state) => {
        state.chatRoom = null
        state.carOwner = null
    }
  }
});

export const {SET_CHAT_ROOM, CLEAR_CHAT} = messageSlice.actions

export default messageSlice.reducer