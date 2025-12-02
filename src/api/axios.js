import axios from "axios";

export const api = axios.create({
  baseURL: "https://my-project-server-hxhq.onrender.com/api",
  withCredentials: true
});