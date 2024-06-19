import axios from "axios";

export const createFeedback = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_SOME_KEY_URL}/feedback/create`,
    data
  );
  return res.data;
};

export const getAllFeedback = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_SOME_KEY_URL}/feedback/getAll`
  );
  return res.data;
};

export const updateFeedback = async (id, data) => {
  const res = await axios.put(
    `${import.meta.env.VITE_SOME_KEY_URL}/feedback/update-feedback/${id}`,
    data
  );
  return res.data;
};

export const deleteFeedback = async (id) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_SOME_KEY_URL}/feedback/delete-feedback/${id}`
  );
  return res.data;
};

export const getFeedbackDetail = async (id) => {
  const res = await axios.get(
    `${import.meta.env.VITE_SOME_KEY_URL}/feedback/get-details/${id}`
  );
  return res.data;
};
