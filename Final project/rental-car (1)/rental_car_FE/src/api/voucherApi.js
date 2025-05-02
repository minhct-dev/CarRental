import fetch from "./fetch";

export const getListCarVoucherApi = async () => {
  let response = await fetch.get("/voucher/list-car-drop-box");
  return response.data.data;
};
export const addNewVoucherCarOwnerApi = async (data) => {
  let response = await fetch.post("/car_owner/create-car-owner-voucher", data);
  return response.data.data;
};
export const getListVoucherCarOwnerApi = async () => {
  let response = await fetch.get("/voucher/list-car-owner-voucher");
  return response.data.data;
};
export const activeVoucherApi = async (id) => {
  let response = await fetch.put("/voucher/activate-voucher?voucherId=" + id);
  return response.data.data;
};
export const deActiveVoucherApi = async (id) => {
  let response = await fetch.put("/voucher/deactivate-voucher?voucherId=" + id);
  return response.data.data;
};
export const deleteVoucherApi = async (id) => {
  let response = await fetch.delete("/voucher/delete-voucher?voucherId=" + id);
  return response.data.data;
};
export const getVoucherDetailApi = async (id) => {
  let response = await fetch.get(`/voucher/voucher-details?voucherId=${id}`);
  return response.data.data;
};
export const editVoucherCarOwner = async (id, data) => {
  let response = await fetch.put(
    `/car_owner/edit-car-owner-voucher?voucherId=${id}`,
    data
  );
  return response.data.data;
};
export const getVoucherListOnCarApi = async (id) => {
  let response = await fetch.get("/voucher/list-car-voucher?carId=" + id);
  return response.data.data;
};
export const createVoucherAdminApi = async (data) => {
  let response = await fetch.post("/admin/create-admin-voucher", data);
  return response.data.data;
};
export const editVoucherAdminApi = async (id, data) => {
  let response = await fetch.put(
    `/admin/edit-admin-voucher?voucherId=${id}`,
    data
  );
  return response.data.data;
};
export const getListVoucherAdminApi = async () => {
  let response = await fetch.get("/voucher/list-admin-voucher");
  return response.data.data;
};
export const activeDisplayVoucherApi = async (id) => {
  let response = await fetch.put(
    `/admin/activate-homepage-display?voucherId=${id}`
  );
  return response.data.data;
};
export const deActiveDisplayVoucherApi = async (id) => {
  let response = await fetch.put(
    `/admin/deactivate-homepage-display?voucherId=${id}`
  );
  return response.data.data;
};

export const searchVoucher = async (carId, code) => {
  let response = await fetch.get("/voucher/search-voucher", {
    params: {
      carId,
      code,
    },
  });
  return response.data.data;
};
