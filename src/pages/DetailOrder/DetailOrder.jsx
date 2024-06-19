import "./DetailOrder.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import { Table } from "antd";
import { useEffect, useState } from "react";

function stringToNumber(str) {
  var num = parseInt(str.replace(/\./g, ""), 10);
  return num;
}

function numberToString(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString(); // Sử dụng toLocaleString() để chuyển đổi thành chuỗi ngày giờ đọc hiểu được bởi người dùng
};

function DetailOrder() {
  const params = useParams();
  const user = useSelector((state) => state?.dataUser);
  const [detailOrder, setDetailOrder] = useState({});
  const navigate = useNavigate();
  const fetchOrderDetail = async () => {
    const res = await OrderService.getOrderDetail(
      user?.access_token,
      params.id
    );
    return res;
  };

  const queryOrderDetail = useQuery({
    queryKey: ["orderdetail"],
    queryFn: fetchOrderDetail,
    config: { retry: 3, retryDelay: 1000 },
  });
  const { isLoading, data } = queryOrderDetail;

  useEffect(() => {
    setDetailOrder(data?.data);
  }, [data]);

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
      title: "Giảm giá",
      dataIndex: "discount",
      render: (text) => <a>{`${text}%`}</a>,
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      render: (text, record) =>
        numberToString(
          Math.ceil(
            (stringToNumber(record.price) * (100 - record.discount)) / 100
          ) * record.amount
        ),
    },
  ];

  return (
    <Loading isLoading={isLoading}>
      <main className="orderdetail">
        <div className="orderdetail__inforship">
          <div className="orderdetail__inforship__address">
            <span className="title">Địa chỉ người nhận</span>
            <div className="orderdetail__inforship__address--infor">
              <span>{`Tên người nhận: ${detailOrder?.shippingAddress?.fullName}`}</span>
              <span>{`Địa chỉ: ${detailOrder?.shippingAddress?.address}`}</span>
              <span>{`Số điện thoại: ${detailOrder?.shippingAddress?.phone}`}</span>
            </div>
          </div>

          <div className="orderdetail__inforship__ship">
            <span className="title">Hình thức giao hàng</span>
            <div className="orderdetail__inforship__ship--infor">
              <span>{`Giao hàng tiết kiệm`}</span>
              <span>{`Phí giao hàng: ${detailOrder?.shippingPrice}đ`}</span>
            </div>
          </div>

          <div className="orderdetail__inforship__payment">
            <span className="title">Hình thức thanh toán</span>
            <div className="orderdetail__inforship__ship--infor">
              <span>{detailOrder?.paymentMethod}</span>
              <span style={detailOrder?.isDelivered === "Chưa giao hàng" || detailOrder?.isDelivered === "Đang giao" ? {color: "red"} : {color: "green"}}>{detailOrder?.isDelivered}</span>
              <span>{`Thời gian đặt đơn: ${formatDateTime(detailOrder?.createdAt)}`}</span>
              {detailOrder?.isDelivered === "Đã nhận được hàng" && (
                <span>{`Thời gian nhận đơn: ${formatDateTime(detailOrder?.updatedAt)}`}</span>
              ) }
            </div>
          </div>
        </div>

        <div className="orderdetail__listorder">
          <Table columns={columns} dataSource={detailOrder?.orderItems} pagination={false} />
        </div>

        <div className="orderdetail__totalprice">
          <span>Tổng tiền: <span style={{color: "red",fontWeight: "500"}}>{numberToString(detailOrder?.totalPrice || 0)}đ</span></span>
        </div>
      </main>
    </Loading>
  );
}

export default DetailOrder;
