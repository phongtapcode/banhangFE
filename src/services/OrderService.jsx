import { axiosJWT } from "./UserService";

export const createOrderProduct = async (access_token, data) => {
  const res = await axiosJWT.post(
    `${import.meta.env.VITE_SOME_KEY_URL}/order/create`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getOrderByUserId = async (access_token, id) => {
  const res = await axiosJWT.get(
    `${import.meta.env.VITE_SOME_KEY_URL}/order/get-allorder/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllOrder = async (access_token) => {
  const res = await axiosJWT.get(
    `${import.meta.env.VITE_SOME_KEY_URL}/order/get-all-order`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getOrderDetail = async (access_token, id) => {
  const res = await axiosJWT.get(
    `${import.meta.env.VITE_SOME_KEY_URL}/order/get-order-detail/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const updateOrder = async (access_token, id, data) => {
  const res = await axiosJWT.put(
    `${import.meta.env.VITE_SOME_KEY_URL}/order/update-order/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const cancelOrder = async (access_token, id, cancelOrder) => {
  const res = await axiosJWT.delete(
    `${import.meta.env.VITE_SOME_KEY_URL}/order/cancel-order/${id}`,
    { data: cancelOrder },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getOrderFilter = async (month) => {
  const res = await axiosJWT.get(
    `${import.meta.env.VITE_SOME_KEY_URL}/order/get-order-filter`,
    {
      params: {
        month: month,
      },
    }
  );
  return res.data;
};
