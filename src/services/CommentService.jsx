import axios from "axios";
export const axiosJWT = axios.create();

export const createComment = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_SOME_KEY_URL}/comment/create`,
    data
  );
  return res.data;
};

export const getAllCommentById = async (id) => {
  const res = await axios.get(
    `${import.meta.env.VITE_SOME_KEY_URL}/comment/getCommentById/${id}`
  );
  return res.data;
};

export const deleteComment = async (id) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_SOME_KEY_URL}/comment/delete/${id}`
  );
  return res.data;
};
