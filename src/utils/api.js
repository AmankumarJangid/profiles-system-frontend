import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const profilesApi = {
  getAll: (params) => api.get("/profiles", { params }),
  getById: (id) => api.get(`/profiles/${id}`),
  create: (formData) =>
    api.post("/profiles", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/profiles/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/profiles/${id}`),
};

export default api;
