import axios from "axios";
import { getToken } from "../utils/auth";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

API.interceptors.request.use((req) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const fetchAdminIssues = () => API.get("/issues");

export const updateIssueStatus = (id, status) =>
  API.patch(`/issues/${id}/status`, { status });

export const updateIssue = (id, data) =>
  API.patch(`/issues/${id}`, data);

export const deleteIssue = (id) =>
  API.delete(`/issues/${id}`);
