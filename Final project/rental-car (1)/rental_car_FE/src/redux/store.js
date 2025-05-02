import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from  "./slice/AuthSlice"
import oldDataRegisterReducer from './slice/oldDataRegisterSlice'
import activeReducer from "./slice/activeSlice"
import addCarReducer from "./slice/addCarSlice"
import bookingReducer from "./slice/bookingSlice"
import stompsClientReducer from "./slice/stompsClient"
import messageReducer from "./slice/messageSlice"
export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    oldDataRegister: oldDataRegisterReducer,
    active: activeReducer,
    addCar: addCarReducer,
    booking: bookingReducer,
    stomps: stompsClientReducer,
    message: messageReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})