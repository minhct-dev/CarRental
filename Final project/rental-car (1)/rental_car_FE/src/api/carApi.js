import fetch from "./fetch";

export const carListAPI = async (sortOption, page, pageSize) => {
  const response = await fetch.get("/car_owner/list_car", {
    params: {
      sort: sortOption,
      Page: page,
      Size: pageSize,
    },
  });
  return response.data.data;
};

export const getCarApi = async (id, startDate, endDate, feedbackPage) => {
  const url = `/car/car_detail?id=${id}&start_date=${encodeURIComponent(
    startDate
  )}&end_date=${encodeURIComponent(endDate)}&feedbackPage=${feedbackPage}`;
  let content = await fetch.get(url);
  return content.data.data;
};

export const searchCarApi = async (data) => {
  let content = await fetch.post("/car/search", data);
  return content.data.data;
};

export const getBrandApi = async () => {
  let content = await fetch.get("/car/brands");
  return content.data.data;
};
export const getColorApi = async () => {
  let content = await fetch.get("/car/colors");
  return content.data.data;
};
export const getModelApi = async (id) => {
  let content = await fetch.get("/car/models/" + id);
  return content.data.data;
};

export const getMaxPrice = async () => {
  let content = await fetch.get("/car/max-price");
  return content.data.data;
};
export const getCarType = async () => {
  let content = await fetch.get("/car/car-type");
  return content.data.data;
};

export const getCarFunctionApi = async () => {
  let content = await fetch.get("/car/car-function");
  return content.data.data;
};

export const addStep1Api = async (data) => {
  let content = await fetch.post("/car_owner/addcar_step1", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return content.data.data;
};

export const addStep2Api = async (data) => {
  let content = await fetch.patch("/car_owner/addcar_step2", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return content.data.data;
};

export const addStep3Api = async (data) => {
  let content = await fetch.patch("/car_owner/addcar_step3", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return content.data.data;
};

export const addStep4Api = async (data) => {
  let content = await fetch.post("/car_owner/addcar_submit", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return content.data.data;
};
export const getProcessDraftApi = async () => {
  let data = await fetch.get("/car_owner/draft_process");
  return data.data.data;
};

export const getDataEditApi = async (id) => {
  let data = await fetch.get(
    "/car_owner/get-car-information-editScreen?carId=" + id
  );
  return data.data.data;
};

export const editDetailApi = async (data) => {
  let content = await fetch.patch("/car_owner/detail-information-edit", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return content.data.data;
};

export const editTermApi = async (data, id) => {
  let content = await fetch.patch(
    "/car_owner/termOfUse-edit?carId=" + id,
    data
  );
  return content.data.data;
};

export const deleteDraftApi = async (id) => {
  let content = await fetch.delete(
    "/car_owner/draft-delete-data?draftId=" + id
  );
  return content.data.data;
};

export const getCarDetailApi = async (id, startDate, endDate, feedbackPage) => {
  let content = await fetch.get("/car/car_detail", {
    params: {
      id: id,
      start_date: startDate,
      end_date: endDate,
      feedbackPage: feedbackPage
    },
  });
  return content.data.data;
};

export const changeCarStatusApi = async (carId) => {
  let response = fetch.patch(`/booking/change-car-status?carId=${carId}`);
  return response.data;
};

export const getListDraftApi = async () => {
  let response = await fetch.get("/car_owner/list_draft");
  return response.data.data;
};

export const getListDraftRequest = async (page, size, type, status, sort) => {
  let response = await fetch.get("/admin/get-car-draft-request", {
    params: {
      sort,
      size,
      page,
      type,
      status,
    },
  });
  return response.data.data;
};

export const approveCarDraftApi = async (id) => {
  let response = await fetch.post("/admin/accept-car-request?draftId=" + id);
  return response.data.data;
};

export const rejectCarDraftApi = async (data) => {
  let response = await fetch.put("/admin/reject-car-request", null, {
    params: {
      draftId: data.id,
      message: data.reason,
    },
  });
  return response.data.data;
};

export const editCarInfomationApi = async (data) => {
  let response = await fetch.post("/car_owner/car-edit-information", data);
  return response.data.data;
};

export const getDetailCarDraft = async (id) => {
  let response = await fetch.get("/car/get-car-request-detail?draftId=" + id);
  return response.data.data;
};

export const reEditDraftCarApi = async (data) => {
  let response = await fetch.put("/car_owner/edit-car-draft", data);
  return response.data.data;
};
export const approveUpdateCarApi = async (id) => {
  let response = await fetch.put(
    "/admin/accept-update-car-request?draftId=" + id
  );
  return response.data.data;
};
export const rejectUpdateCarApi = async (data) => {
  let response = await fetch.put("/admin/reject-update-car-request", null, {
    params: {
      draftId: data.id,
      message: data.reason,
    },
  });
  return response.data.data;
};

export const deleteCarApi = async (carId) => {
  let response = await fetch.patch(`/car_owner/car-delete?carId=${carId}`);
  return response.data.data;
};

export const getDraftDetailAdminApi = async (id) => {
  let response = await fetch.get(
    "/admin/get-car-request-detail-admin?draftId=" + id
  );
  return response.data.data;
};

export const deteleDraftUpdateApi = async (id) => {
  let response = await fetch.delete(
    "/car_owner/cancel-update-draft?draftId=" + id
  );
  return response.data.data;
};

export const getDashboardCarOwnerApi = async (
  startWeekDate,
  endWeekDate,
  startMonthDate,
  endMonthDate
) => {
  let response = await fetch.get("/car_owner/dashboard", {
    params: {
      startWeekDate,
      endWeekDate,
      startMonthDate,
      endMonthDate,
    },
  });
  return response.data.data;
};
