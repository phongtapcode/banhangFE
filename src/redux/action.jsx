import { createAction } from "@reduxjs/toolkit";

const setUserInfor = createAction("setUserInfor");
const resetUser = createAction("resetUser");
const valueSearch = createAction("valueSearch");
const addOrderProduct = createAction("addOrderProduct");
const removeOrderProduct = createAction("removeOrderProduct");
const increaseAmount = createAction("increaseAmount");
const decreaseAmount = createAction("decreaseAmount");
const removeListOrderProduct = createAction("removeListOrderProduct");
const selectedOrder = createAction("selectedOrder");

export {
    setUserInfor,
    resetUser,
    valueSearch,
    addOrderProduct,
    removeOrderProduct,
    increaseAmount,
    decreaseAmount,
    removeListOrderProduct,
    selectedOrder
}