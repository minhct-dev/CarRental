import fetch from "./fetch"

export const getVoucherHomePageApi = async () => {
    let response = await fetch.get("/homepage/homepage-information")
    return response.data.data
}