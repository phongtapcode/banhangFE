import "./OrderSuccess.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StepComponent from "../../components/StepComponent/StepComponent";

function stringToNumber(str) {
  var num = parseInt(str.replace(/\./g, ""), 10);
  return num;
}

function numberToString(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function OrderSuccess() {
  const orderProducts = useSelector((state) => state.orderProduct);
  const user = useSelector((state) => state.dataUser);
  const [listSelectedOrderProducts, setListSelectedOrderProducts] = useState(
    []
  );

  const navigate = useNavigate();

  const [prices, setPrices] = useState({
    oldPrice: 0,
    voucherPrice: 0,
    newPrice: 0,
    shipPrice: 0,
  });

  useEffect(() => {
    const oldPrice = listSelectedOrderProducts.reduce(
      (total, currentValue) =>
        total + stringToNumber(currentValue.price) * currentValue.amount,
      0
    );

    const voucherPrice = listSelectedOrderProducts.reduce(
      (total, currentValue) =>
        total +
        Math.ceil(
          (stringToNumber(currentValue.price) * currentValue.discount) / 100
        ) *
          currentValue.amount,
      0
    );

    const shipPrice = oldPrice - voucherPrice > 500000 ? 0 : 50000;

    setPrices({
      oldPrice,
      voucherPrice: voucherPrice,
      shipPrice,
      newPrice: oldPrice - voucherPrice + (oldPrice === 0 ? 0 : shipPrice),
    });

    setListSelectedOrderProducts(orderProducts.orderItemsSelected);
  }, [listSelectedOrderProducts]);

  return (
    <>
      <StepComponent stepCurrent={user?.id ? 2 : 0} />
      <main className="ordersuccess">
        <div className="ordersuccess__icon">
          <i className="fa-solid fa-circle-check"></i>
          <span>Đặt hàng thành công</span>
        </div>
        <div className="ordersuccess__item">
          <span>Phương thức thanh toán</span>
          <span>Thanh toán khi nhận hàng(COD)</span>
        </div>
        <div className="ordersuccess__item">
          <span>Thời gian dự kiến giao hàng</span>
          <span>3-5 ngày</span>
        </div>
        <div className="ordersuccess__item">
          <span>Tổng thanh toán</span>
          <span style={{ color: "red", fontWeight: "600" }}>
            {numberToString(prices.newPrice)}
          </span>
        </div>
        <div className="ordersuccess__item">
          <span>Tình trạng</span>
          <span style={{ color: "red", fontWeight: "600" }}>
            Chưa thanh toán
          </span>
        </div>

        <div className="ordersuccess__button">Mua sắm tiếp</div>
      </main>
    </>
  );
}

export default OrderSuccess;
