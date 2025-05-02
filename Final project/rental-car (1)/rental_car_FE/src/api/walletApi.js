import fetch from "./fetch"

export const topUpApi = async (data) => {
    let content = await fetch.post("/wallet/topup",data)
    return content.data.data
}

export const widthDrawApi = async (data) => {
    let content = await fetch.post("/wallet/withdraw",data)
    return content.data.data
}

export let walletHistoryApi = async (page = 1, size = 10, from = null, to = null) => {
    let params = { page, size };
    if (from) params.from = from;
    if (to) params.to = to;
    let response = await fetch.get("/wallet/view", { params });
    return response.data.data;
  };

