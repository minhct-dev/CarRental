import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    car: null,
    startDate: null,
    endDate:null,
    id:null,
    voucher: null,
    listVoucher: []
}

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    GO_TO_BOOKING: (state, action) =>{
        let {data, startIos, endIos,id, selectVoucher, voucher} = action.payload
        state.car = data
        state.startDate = startIos
        state.endDate = endIos
        state.id = id
        state.voucher = selectVoucher
        state.listVoucher = voucher
    }
  }
});

export const {GO_TO_BOOKING} = bookingSlice.actions

export default bookingSlice.reducer