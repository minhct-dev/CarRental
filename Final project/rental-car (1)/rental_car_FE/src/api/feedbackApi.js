import fetch from "./fetch";

export const getFeedbackReportApi = async (
  page,
  pageSize,
  sortOption,
  starRating
) => {
  let response = await fetch.get("/car_owner/feedback-report-view", {
    params: {
      page: page,
      size: pageSize,
      sort: sortOption,
      starRating: starRating,
    },
  });
  return response.data.data;
};

export const giveFeedbackApi = async (data) => {
  let response = await fetch.post("/feedback/give-booking", data);
  return response.data.data;
}
