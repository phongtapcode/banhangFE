import { createReducer } from "@reduxjs/toolkit";
import {
  setUserInfor,
  resetUser,
  valueSearch,
  addOrderProduct,
  removeOrderProduct,
  increaseAmount,
  decreaseAmount,
  removeListOrderProduct,
  selectedOrder
} from "./action";

const initialValue = {
  dataUser: {
    id: "",
    name: "",
    email: "",
    phone: "",
    access_token: "",
    address: "",
    avatar: "",
    isAdmin: false,
    refresh_token: ""
  },
  valueSearch: "",
  orderProduct: {
    orderItems: [],
    orderItemsSelected: [],
    shippingAddress: {},
    paymentMethod: "",
    itemsPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    user: "",
    isPaid: false,
    paidAt: "",
    isDelivered: false,
    deliveredAt: "",
  },
};

const Reducer = createReducer(initialValue, (builder) => {
  builder
    .addCase(setUserInfor, (state, action) => {
      state.dataUser.id = action.payload._id;
      state.dataUser.name = action.payload.name || "Phong Bá";
      state.dataUser.email = action.payload.email;
      state.dataUser.address = action.payload.address;
      state.dataUser.phone = action.payload.phone;
      state.dataUser.avatar = action.payload.avatar;
      state.dataUser.access_token = action.payload.access_token;
      state.dataUser.isAdmin = action.payload.isAdmin;
      state.dataUser.refresh_token = action.payload.refresh_token;
    })

    .addCase(resetUser, (state) => {
      state.dataUser.id = "";
      state.dataUser.name = "";
      state.dataUser.email = "";
      state.dataUser.access_token = "";
      state.dataUser.address = "";
      state.dataUser.phone = "";
      state.dataUser.avatar = "";
      state.dataUser.isAdmin = false;
    })

    .addCase(valueSearch, (state, action) => {
      state.valueSearch = action.payload;
    })

    .addCase(addOrderProduct, (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state.orderProduct?.orderItems?.find(
        (item) => item?.product === orderItem.product
      );

      if (itemOrder) {
        itemOrder.amount += orderItem?.amount;
      } else {
        state.orderProduct.orderItems.unshift(orderItem);
      }
    })

    .addCase(removeOrderProduct, (state, action) => {
      const idProduct = action.payload;
      const itemOrder = state.orderProduct?.orderItems?.filter(
        (item) => item?.product !== idProduct
      );
      state.orderProduct.orderItems = itemOrder;
    })

    .addCase(increaseAmount, (state, action) => {
      const idProduct = action.payload;
      const itemOrder = state.orderProduct?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      itemOrder.amount--;
    })

    .addCase(decreaseAmount, (state, action) => {
      const idProduct = action.payload;
      const itemOrder = state.orderProduct?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      itemOrder.amount++;
    })

    .addCase(removeListOrderProduct, (state, action) => {
      const listChecked = action.payload;

      const itemOrder = state.orderProduct?.orderItems?.filter(
        (item) =>
          !listChecked.some((itemChecked) => itemChecked.id === item.product)
      );

      state.orderProduct.orderItems = itemOrder;
    })

    .addCase(selectedOrder, (state, action) => {
      const listChecked = action.payload
      state.orderProduct.orderItemsSelected = listChecked;
    });
});

export default Reducer;
