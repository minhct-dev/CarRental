import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    registerFormData: null, // Lưu dữ liệu form
  };
const  oldDataRegisterSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveRegisterData: (state, action) => {
      state.registerFormData = action.payload;
    },
    clearRegisterData: (state) => {
      state.registerFormData = null;
    },
  },
});

export const { saveRegisterData, clearRegisterData } = oldDataRegisterSlice.actions;
export default  oldDataRegisterSlice.reducer;
