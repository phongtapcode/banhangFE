import "./OrderPage.scss";
import { useEffect, useState } from "react";
import { Table, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as message from "../../components/Message/Message";
import {
  increaseAmount,
  decreaseAmount,
  removeOrderProduct,
  removeListOrderProduct,
  selectedOrder,
} from "../../redux/action";
import StepComponent from "../../components/StepComponent/StepComponent";

function stringToNumber(str) {
  var num = parseInt(str.replace(/\./g, ""), 10);
  return num;
}

function numberToString(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function OrderPage() {
  const orderProducts = useSelector((state) => state.orderProduct);
  const user = useSelector((state) => state.dataUser);
  const [inforShip, setInforShip] = useState({
    name: user.name || "Chưa cập nhật",
    phone: user.phone || "Chưa cập nhật",
    address: user.address || "Chưa cập nhật",
  });
  const [isHiddenPayment, setIsHiddenPayment] = useState(false);
  const [listOrderProducts, setListOrderProducts] = useState([]);
  const [listSelectedOrderProducts, setListSelectedOrderProducts] = useState(
    []
  );
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prices, setPrices] = useState({
    oldPrice: 0,
    voucherPrice: 0,
    newPrice: 0,
    shipPrice: 0,
  });
  const dispatch = useDispatch();

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

  const renderAmount = (countProduct, id) => {
    return (
      <div className="orderproduct__listproduct__changeamount">
        <button
          onClick={() => {
            dispatch(increaseAmount(id));
          }}
          style={countProduct === 1 ? { pointerEvents: "none" } : {}}
        >
          -
        </button>
        <span>{countProduct}</span>
        <button
          onClick={() => {
            dispatch(decreaseAmount(id));
          }}
        >
          +
        </button>
      </div>
    );
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListSelectedOrderProducts(selectedRows);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (text, record) => (
        <img src={record.image} alt="avatar" style={{ width: "100px" }} />
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      render: (text, record) => renderAmount(text, record.id),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Xóa",
      render: (text, record) => (
        <i
          className="fa-solid fa-trash"
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleDeleteOrderProduct(record.id);
          }}
        ></i>
      ),
    },
  ];

  const handleDeleteOrderProduct = (id) => {
    dispatch(removeOrderProduct(id));
    setListSelectedOrderProducts(
      listOrderProducts.filter((item) =>
        listSelectedOrderProducts.some(
          (itemChecked) => itemChecked.id === item.id
        )
      )
    );
  };

  const handleDeleteListOrderProduct = () => {
    dispatch(removeListOrderProduct(listSelectedOrderProducts));
    setListSelectedOrderProducts(
      listOrderProducts.filter((item) =>
        listSelectedOrderProducts.some(
          (itemChecked) => itemChecked.id === item.id
        )
      )
    );
  };

  const handleUpdateUser = () => {
    setIsModalOpen(false);
    navigate("/profile");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDetailUser = () => {
    setIsModalOpen(true);
  };

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
      dispatch(selectedOrder(listSelectedOrderProducts));
      navigate("/payment");
    }
  };

  return (
    <main className="orderproduct">
      <StepComponent stepCurrent={user?.id ? 1 : 0} />
      <div className="orderproduct__listproduct">
        <Table
          rowSelection={{
            ...rowSelection,
          }}
          columns={columns}
          dataSource={listOrderProducts}
        />
      </div>

      <div className="orderproduct__payment">
        <i
          className="fa-solid fa-chevron-down icon__hidden"
          onClick={() => setIsHiddenPayment(!isHiddenPayment)}
          style={{
    transform: isHiddenPayment ? 'rotate(0deg)' : 'rotate(180deg)',
    transition: 'transform 0.3s ease-in-out',
    cursor: 'pointer',
  }}
        ></i>

        {isHiddenPayment && (
          <>
            <div className="orderproduct__payment__selectlistroder">
              <div className="orderproduct__payment__selectlistroder--left">
                <span className="selected">{`Đã chọn (${listSelectedOrderProducts?.length}) sản phẩm`}</span>
                <span
                  className="deleteselected"
                  onClick={handleDeleteListOrderProduct}
                >
                  Xóa
                </span>
              </div>
              <div className="orderproduct__payment__selectlistroder--right">
                <span className="userinfor">
                  {`Địa chỉ giao: `}
                  <i>{inforShip?.address}</i>
                  <span onClick={handleDetailUser}>Thay đổi</span>
                </span>
                <Modal
                  title="Thông tin giao hàng"
                  open={isModalOpen}
                  onOk={handleUpdateUser}
                  onCancel={handleCancel}
                  okText={"Cập nhật lại thông tin"}
                >
                  <div className="inforship__item">
                    {`Tên người nhận: ${inforShip?.name}`}
                  </div>
                  <div className="inforship__item">
                    {`Số điện thoại: ${inforShip?.phone}`}
                  </div>
                  <div className="inforship__item">
                    {`Địa chỉ: ${inforShip?.address}`}
                  </div>
                </Modal>
              </div>
            </div>

            <div className="orderproduct__payment__voucher">
              <span>
                <i className="fa-solid fa-ticket"></i> Sử dụng voucher
              </span>
            </div>
          </>
        )}

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
              Mua hàng
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderPage;
