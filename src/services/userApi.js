import axios from "axios";

const API_BASE = "http://localhost:5000/api/users";

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

export const getMyProfile = async () => {
    const res = await axios.get(`${API_BASE}/me`, getAuthHeaders());
    return res.data;
};

export const updateMyProfile = async (data) => {
    const res = await axios.put(`${API_BASE}/me`, data, getAuthHeaders());
    return res.data;
};
