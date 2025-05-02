import fetch from "./fetch";

export const getProvinceApi = async () => {
    let data = await fetch.get("/address/province");
    return data.data.data;
}
export const getDistrictApi = async (provinceId) => {
    let data = await fetch.get(`/address/district?code=${provinceId}`);
    return data.data.data;
}
export const getWardApi = async (districtId) => {
    let data = await fetch.get(`/address/ward?code=${districtId}`);
    return data.data.data;
}