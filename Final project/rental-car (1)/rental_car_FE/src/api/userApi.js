import fetch from "./fetch";

export const getProfileApi = async () => {
  let data = await fetch.get("/user/profile");
  return data.data.data;
};
export const updateProfileApi = async (data) => {
  let content = await fetch.patch("/user/profile-draft", data);
  return content.data.data;
};

export const uploadAvatarApi = async (data) => {
  let content = await fetch.put("/user/avatar", data);
  return content.data.data;
};

export const updateLicenseDriverApi = async (data) => {
  let content = await fetch.put("/user/driving-license", data);
  return content.data.data;
};

export const updateDraftProfile = async (data) => {
  let content = await fetch.patch("/user/profile-draft", data);
  return content.data.data;
}

export const getProfileDraftApi = async () => {
  let data = await fetch.get("/user/profile-draft");
  return data.data.data;
};;

export const getCarOwnerProfile = async ({ownerId, carPage, feedbackPage}) => {
  let response = await fetch.get(`/user/car-owner-profile/${ownerId}`,{
    params:{
      carPage:carPage || 1,
      feedbackPage:feedbackPage || 1,
    }
  })
  return response.data.data;
};
