import fetch from "./fetch"

export const registerApi = async (data) =>{
    let content = await fetch.post("/auth/register", data)
    return content.data.data
}

export const loginApi = async (data) =>{
    let content = await fetch.post("/auth/login", data)
    return content.data.data
}

export const activeAccountApi = async (token) =>{
    let content = await fetch.get("/auth/activate?token="+token)
    return content.data.data
}

export const sendMailForgotApi = async (email) =>{
    let content = await fetch.get("/auth/forgot?email="+email)
    return content.data.data
}

export const resetPasswordApi = async (data) =>{
    let content = await fetch.post("/auth/reset",data)
    return content.data.data
}
export const logoutApi = async () => {
    let data = await fetch.get("/auth/logout")
    return data.data.data
}

export const reActiveApi =  async (email) => {
    let data = await fetch.post("/auth/re-active?email="+email)
    return data.data.data
}

export const checkTokenForgotApi = async (token) => {
    let data = await fetch.get("/auth/checkToken?token="+token)
    return data.data.data
}