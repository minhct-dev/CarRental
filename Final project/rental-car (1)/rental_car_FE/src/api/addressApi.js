import fetch from "./fetch";
import { DEMO_DISTRICTS, DEMO_MODE, DEMO_PROVINCES, DEMO_WARDS } from "../data/demoData";

export const getProvinceApi = async () => {
    if (DEMO_MODE) return DEMO_PROVINCES;
    let data = await fetch.get("/address/province");
    return data.data.data;
}
export const getDistrictApi = async (provinceId) => {
    if (DEMO_MODE) return DEMO_DISTRICTS.filter((item) => item.provinceCode === String(provinceId));
    let data = await fetch.get(`/address/district?code=${provinceId}`);
    return data.data.data;
}
export const getWardApi = async (districtId) => {
    if (DEMO_MODE) return DEMO_WARDS.filter((item) => item.districtCode === String(districtId));
    let data = await fetch.get(`/address/ward?code=${districtId}`);
    return data.data.data;
}