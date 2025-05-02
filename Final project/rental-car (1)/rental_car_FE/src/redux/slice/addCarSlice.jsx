import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    step: null
}

const addCarSlice = createSlice({
  name: "addCar",
  initialState,
  reducers: {
    SAVE_STEP: (state) => {
        state.step = 3
    },
    CLEAR_STEP: (state) => {
        state.step = null 
    }
  }
});

export const {SAVE_STEP, CLEAR_STEP} = addCarSlice.actions

export default addCarSlice.reducer