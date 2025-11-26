import axios from "axios";

export const api = axios.create({
  baseURL: "https://my-project-server-c3tr.onrender.com/api",
  withCredentials: true
});