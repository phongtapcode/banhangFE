import "./PaymentPage.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as message from "../../components/Message/Message";
import { useMutation } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import Loading from "../../components/Loading/Loading";
import StepComponent from "../../components/StepComponent/StepComponent";

const plainOptions = [
  "Thanh toán khi nhận hàng",
  "Chuyển khoản vào số tài khoản",
];

function stringToNumber(str) {
  var num = parseInt(str.replace(/\./g, ""), 10);
  return num;
}

function numberToString(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function PaymentPage() {
  const orderProducts = useSelector((state) => state.orderProduct);
  const user = useSelector((state) => state.dataUser);
  const [inforShip, setInforShip] = useState({
    name: user.name || "Chưa cập nhật",
    phone: user.phone || "Chưa cập nhật",
    address: user.address || "Chưa cập nhật",
  });
  const [listOrderProducts, setListOrderProducts] = useState([]);
  const [listSelectedOrderProducts, setListSelectedOrderProducts] = useState(
    []
  );
  const [selectedOption, setSelectedOption] = useState(
    "Thanh toán khi nhận hàng"
  );

  const navigate = useNavigate();

  const [prices, setPrices] = useState({
    oldPrice: 0,
    voucherPrice: 0,
    newPrice: 0,
    shipPrice: 0,
  });

  useEffect(() => {
    setInforShip({
      name: user.name || "Chưa cập nhật",
      phone: user.phone || "Chưa cập nhật",
      address: user.address || "Chưa cập nhật",
    });
  }, [user]);

  useEffect(() => {
    setListOrderProducts(
      orderProducts?.orderItems?.map((product, i) => ({
        key: i + 1,
        image: product.image,
        name: product.name,
        price: numberToString(product.price),
        amount: product.amount,
        discount: parseInt(product.discount),
        totalPrice: numberToString(
          stringToNumber(product.price) * product.amount
        ),
        id: product.product,
      }))
    );
  }, [orderProducts]);

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

  useEffect(() => {
    setListSelectedOrderProducts(
      listOrderProducts.filter((item) =>
        listSelectedOrderProducts.some(
          (itemChecked) => itemChecked.id === item.id
        )
      )
    );
  }, [listOrderProducts]);

  const handlePayment = () => {
    if (listSelectedOrderProducts.length === 0) {
      message.error("Vui lòng chọn sản phẩm");
    } else if (
      inforShip.name === "Chưa cập nhật" ||
      inforShip.address === "Chưa cập nhật" ||
      inforShip.phone === "Chưa cập nhật"
    ) {
      message.error("Vui lòng nhập đủ thông tin giao hàng");
    } else {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: listSelectedOrderProducts,
        fullName: user?.name,
        phone: user?.phone,
        address: user?.address,
        paymentMethod: selectedOption,
        itemsPrice: prices?.oldPrice,
        shippingPrice: prices?.shipPrice,
        totalPrice: prices?.newPrice,
        user: user?.id,
        email: user?.email
      });
    }
  };

  const mutationAddOrder = useMutation({
    mutationFn: (data) => {
      const { token, ...dataAddOrder } = data;
      return OrderService.createOrderProduct(token, dataAddOrder);
    },
  });

  const { data,isPending: isLoadingAddOrder, isSuccess, isError } = mutationAddOrder;

  useEffect(()=>{
    if(data?.status === "OK"){
      message.success("Đặt hàng thành công");
      navigate("/ordersuccess");
    }else if(data?.status === "ERR"){
      message.error("Sản phẩm không tồn tại hoặc hết sản phẩm");
    }
  },[isSuccess,isError])

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };
  
  return (
    <Loading isLoading={isLoadingAddOrder}>
          <StepComponent stepCurrent={user?.id ? 1 : 0}/>
      <main className="orderproduct">
        <div className="orderproduct__main">
          <div className="orderproduct__main__inforship">
            <div className="orderproduct__main__inforship__infor">
              <h1>Giao tới</h1>
              <span>{inforShip.name}</span>
              <span>{inforShip.phone}</span>
              <span>{inforShip.address}</span>
            </div>
            <div className="orderproduct__main__inforship__changeinfor">
              <a href="/profile">Thay đổi</a>
            </div>
          </div>
        </div>

        <div className="orderproduct__methodpay">
          <h1>Chọn phương thức thanh toán</h1>
          {plainOptions.map((option) => (
            <div key={option} className="orderproduct__methodpay__checkbox">
              <input
                type="radio"
                id={option}
                value={option}
                checked={selectedOption === option}
                onChange={handleRadioChange}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
        <div className="orderproduct__payment">
          <div className="orderproduct__payment__preparebill">
            <div className="orderproduct__payment__preparebill__calculate">
              <div className="orderproduct__payment__preparebill__calculate--item">
                <span className="title">Tổng tiền</span>
                <span className="price">{`${numberToString(
                  prices.oldPrice
                )}`}</span>
              </div>
              <div className="orderproduct__payment__preparebill__calculate--item">
                <span className="title">Giảm giá voucher</span>
                <span className="price">{`-${numberToString(
                  prices.voucherPrice
                )}đ`}</span>
              </div>
              <div className="orderproduct__payment__preparebill__calculate--item">
                <span className="title">Phí ship</span>
                <span className="price">{`+${numberToString(
                  prices.shipPrice
                )}đ`}</span>
              </div>
            </div>
            <div className="orderproduct__payment__preparebill__totalprice">
              <div className="orderproduct__payment__preparebill__totalprice--price">
                <span className="title">{`Cần thanh toán (${listSelectedOrderProducts?.length}) sản phẩm`}</span>
                <span className="price">{`${numberToString(
                  prices.newPrice
                )}đ`}</span>
              </div>
              <div
                className="orderproduct__payment__preparebill__totalprice--buttonpay"
                onClick={handlePayment}
              >
                Đặt hàng
              </div>
            </div>
          </div>
        </div>
      </main>
    </Loading>
  );
}

export default PaymentPage;
