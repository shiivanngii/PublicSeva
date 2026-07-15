import axios from "axios";

const API_BASE = "http://localhost:5000/api/issues";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

export const createIssue = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    API_BASE,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return res.data;
};

export const getAllIssues = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const toggleLike = async (issueId) => {
  const res = await axios.post(`${API_BASE}/${issueId}/like`, {}, getAuthHeaders());
  return res.data;
};

export const addComment = async (issueId, text) => {
  const res = await axios.post(`${API_BASE}/${issueId}/comment`, { text }, getAuthHeaders());
  return res.data;
};

export const getMyIssues = async () => {
  const res = await axios.get(`${API_BASE}/my`, getAuthHeaders());
  return res.data;
};
