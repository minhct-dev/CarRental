import fetch from "./fetch";
export const getBookingListApi = async (sortOption, page, pageSize) => {
  const response = await fetch.get("/booking/list", {
    params: {
      sort: sortOption,
      Page: page,
      Size: pageSize,
    },
  });
  return response.data.data;
};

export const confirmDepositApi = async (bookingId) => {
  let response = await fetch.patch(`/booking/confirm-deposit/${bookingId}`);
  return response.data.data;
};
export const confirmPaymentApi = async (bookingId) => {
  let response = await fetch.patch(`/booking/confirm-payment/${bookingId}`);
  return response.data.data;
};

export const getBookingApi = async (id) => {
  let response = await fetch.get(`/booking/getBooking?bookingId=${id}`);
  return response.data.data;
};

export const editBookingDetailApi = async (id, data, frontFile, backFile) => {
  let formData = new FormData();

  formData.append("bookingId", id);
  formData.append("obj", JSON.stringify(data));

  if (frontFile) {
    formData.append("driverLicenseFront", frontFile);
  }
  if (backFile) {
    formData.append("driverLicenseBack", backFile);
  }

  let response = await fetch.put("/booking/edit", formData);

  return response.data.data;
};

export const rentCarApi = async (data) => {
  let response = await fetch.post("/booking/rent-car", data);
  return response.data.data;
};

export const confirmPickupApi = async (bookingId) => {
  let response = await fetch.patch(`/booking/confirm-pickup/${bookingId}`);
  return response.data.data;
};

export const cancelBookingApi = async ({ bookingId }) => {
  let response = await fetch.put(
    `/booking/cancel-booking?bookingId=${bookingId}`);
  return response.data.data;
};

export const getPercentageCancel = async (bookingId, cancelDate) => {
  let response = await fetch.get("/booking/get-percent-value", {
    params: { bookingId: bookingId, cancelDate: cancelDate },
  });
  return response.data.data;
};

export const getListBookingApi = async (page, size, sort) => {
  let response = await fetch.get("/booking/carOwner/list", {
    params: {
      page,
      size,
      sort,
    },
  });
  return response.data.data;
};
export const returnCarApi = async (id, time) => {
  console.log(id, time);

  const response = await fetch.patch("/booking/return-car", null, {
    params: {
      bookingId: id,
      actualTime: time,
    },
  });
  return response.data.data;
};

export const paidPaymentApi = async (id) => {
  const response = await fetch.put("/booking/paid-payment", null, {
    params: {
      bookingId: id,
    },
  });
  return response.data.data;
};

export const getBillApi = async (bookingId) => {
  const response = await fetch.get("/booking/return-bill", {
    params: {
      bookingId,
    },
  });
  return response.data.data;
};

export const getPercentageCancelCarOwner = async (bookingId, cancelDate) => {
  let response = await fetch.get("/booking/get-value-owner", {
    params: { bookingId: bookingId, cancelDate: cancelDate },
  });
  return response.data.data;
};

export const cancelBookingCarOwnerApi = async ({ bookingId, cancelDate }) => {
  let response = await fetch.put(
    `/booking/cancel-booking-owner?bookingId=${bookingId}&cancelDate=${encodeURIComponent(
      cancelDate
    )}`
  );
  return response.data.data;
};

export const handleCancelBookingCarOwnerApi = async ({ bookingId, choice }) => {
  let response = await fetch.put("/booking/handling-cancel", null, {
    params: {
      bookingId,
      choice,
    },
  });

  return response.data.data;
};
export const sendCancelRequestCustomer = async (bookingId) => {
  let response = await fetch.put("/booking/cancel-booking-by-customer", null, {
    params:{
      bookingId
    }
  })
  return response.data.data
}

export const checkCancelStatusApi = async (bookingId) =>{
  let response = await fetch.get("/booking/check-car-owner-status", {
    params:{
      bookingId
    }
  })
  return response.data.data
}

export const rejectBookingDriverApi = async (bookingId) => {
  let response = await fetch.patch("/booking/cancel-booking-by-driver", null, {
    params:{
      bookingId
    }
  })
  return response.data.data
}

export const rejectBookingCarOwnerApi = async (bookingId) => {
  let response = await fetch.put("/booking/cancel-booking-by-owner", null, {
    params:{
      bookingId
    }
  })
  return response.data.data
}