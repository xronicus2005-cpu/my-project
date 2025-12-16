import axios from "axios";

let startLoader;
let stopLoader;

export const injectLoader = (start, stop) => {
  startLoader = start;
  stopLoader = stop;
};

export const api = axios.create({
  baseURL: "https://my-project-server-hxhq.onrender.com/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    startLoader?.();
    return config;
  },
  (error) => {
    stopLoader?.();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    stopLoader?.();
    return response;
  },
  (error) => {
    stopLoader?.();
    return Promise.reject(error);
  }
);
