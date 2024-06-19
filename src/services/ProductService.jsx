import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllProduct = async (search) => {
    let res = {};
    if(search?.length > 0) {
       res = await axios.get(`${import.meta.env.VITE_SOME_KEY_URL}/product/getAll?filter=name&filter=${search}`);
    }else{
       res = await axios.get(`${import.meta.env.VITE_SOME_KEY_URL}/product/getAll`);
    }
      return res.data;
}

export const getAllProductFilter = async (valueFilter) => {
    const res = await axios.get(`${import.meta.env.VITE_SOME_KEY_URL}/product/getAllFilter`,{
      params: valueFilter
    });
    return res.data;
}

export const createProduct = async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_SOME_KEY_URL}/product/create`,data);
    return res.data;
}

export const getDetailProduct = async (id) => {
  const res = await axios.get(`${import.meta.env.VITE_SOME_KEY_URL}/product/get-details/${id}`);
    return res.data;
}

export const updateProduct = async (id,data,access_token) => {
  const res = await axiosJWT.put(`${import.meta.env.VITE_SOME_KEY_URL}/product/update/${id}`,data,{
    headers: { 
      token: `Bearer ${access_token}`
    }
  });
    return res.data;
}

export const deleteProduct = async (id,access_token) => {
  const res = await axiosJWT.delete(`${import.meta.env.VITE_SOME_KEY_URL}/product/delete/${id}`,{
    headers: { 
      token: `Bearer ${access_token}`
    }
  });
    return res.data;
}