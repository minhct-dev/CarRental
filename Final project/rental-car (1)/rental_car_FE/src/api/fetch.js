import axios from "axios";
import { queryClient } from "../main";

const fetch = axios.create({
  baseURL: "http://localhost:8080/",
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

fetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

fetch.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và là lỗi hết hạn
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Token has expired" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Chờ refresh xong rồi retry lại
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return fetch(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");

      try {
        const res = await axios.post(
          "http://localhost:8080/auth/refresh-token",
          null,
          {
            params: {
              Rtoken: refreshToken,
            },
          }
        );

        const newAccessToken = res.data.data;
        localStorage.setItem("access_token", newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = "Bearer " + newAccessToken;
        return fetch(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // Nếu refresh thất bại → logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        queryClient.removeQueries(["profile"]);
        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Các lỗi khác
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      queryClient.removeQueries(["profile"]);
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default fetch;
