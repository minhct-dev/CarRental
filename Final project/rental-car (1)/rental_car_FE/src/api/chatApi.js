import fetch from "./fetch"

export const getChatRoomApi = async () => {
    const response = await fetch.get("/chat-box/list-chat-box")
    return response.data.data
}
export const getMessageHistoryApi = async (chatId) => {
    const response = await fetch.get("/chat-box/history-message?chatId="+chatId)
    return response.data.data
}

export const getNotifyMessageApi = async () => {
    const response  = await fetch.get("/chat-box/list-notification")
    return response.data.data
}