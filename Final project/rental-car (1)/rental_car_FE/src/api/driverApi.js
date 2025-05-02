import fetch from "./fetch";

export const getRequestListApi = async () => {
  let response = await fetch.get("/booking/driver-booking-list");
  return response.data.data;
};

export const searchDriverApi = async (
  startDate,
  endDate,
  provinceCode,
  districtCode,
  wardCode
) => {
  let response = await fetch.get("/driver/search", {
    params: {
      startDate,
      endDate,
      provinceCode,
      districtCode,
      wardCode,
    },
  });
  return response.data.data;
};

export const driverConfirmApi = async (bookingId) => {
  let response = await fetch.patch(`/booking/driver-confirm/${bookingId}`);
  return response.data.data;
};

export const getDashboardDriverApi = async (
  startWeekDate,
  endWeekDate,
  startMonthDate,
  endMonthDate
) => {
  let response = await fetch.get("/driver/dashboard", {
    params: {
      startWeekDate,
      endWeekDate,
      startMonthDate,
      endMonthDate,
    },
  });
  console.log(1);
  
  return response.data.data;
};
