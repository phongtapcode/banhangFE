import "./MyOrder.scss";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading/Loading";
import * as message from "../../components/Message/Message";
import { useNavigate } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Modal, Select } from "antd";
import { useEffect, useState } from "react";

function numberToString(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString(); // Sử dụng toLocaleString() để chuyển đổi thành chuỗi ngày giờ đọc hiểu được bởi người dùng
};

function MyOrder() {
  const user = useSelector((state) => state?.dataUser);
  const [idCancel, setIdCancel] = useState("");
  const [ordersCancel, setOrdersCancel] = useState([]);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [stateOrder, setStateOrder] = useState("Tất cả đơn hàng");
  const [listOrderFilter, setListOrderFilter] = useState([]);
  const navigate = useNavigate();

  const fetchMyOrder = async () => {
    setIsLoadingOrder(true);
    const res = await OrderService.getOrderByUserId(
      user?.access_token,
      user?.id
    );
    setIsLoadingOrder(false);
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["order"],
    queryFn: fetchMyOrder,
    config: { retry: 3, retryDelay: 1000 },
  });

  const { data } = queryOrder;

  useEffect(() => {
    setListOrderFilter(data?.data);
  },[data])

  const handleDetailOrder = (id) => {
    navigate(`/detail-order/${id}`);
  };

  const mutationCancel = useMutation({
    mutationFn: (dataCancelOrder) => {
      const { idCancel, token, ordersCancel } = dataCancelOrder;
      return OrderService.cancelOrder(token, idCancel, ordersCancel);
    },
  });

  const { isPending: isLoadingCancel } = mutationCancel;

  const handleCancelOrder = (id, orderItems) => {
    setOrdersCancel(orderItems);
    setIdCancel(id);
    setIsModalOpenDelete(true);
  };

  const handleOkDelete = () => {
    mutationCancel.mutate(
      { idCancel, token: user?.access_token, ordersCancel },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
  };

  const handleCancelDelte = () => {
    setIsModalOpenDelete(false);
  };

  const mutationUpdate = useMutation({
    mutationFn: (dataUpdateOrder) => {
      const { token, id, data } = dataUpdateOrder;
      return OrderService.updateOrder(token, id, data);
    },
  });

  const { isPending: isLoadingUpdate } = mutationUpdate;

  const handleUpdateDelivery = (id, isDelivered) => {
    if (isDelivered === "Chưa giao hàng") {
      message.error("Đơn hàng đang được xử lí");
    } else {
      mutationUpdate.mutate(
        {
          token: user?.access_token,
          id: id,
          data: {
            isDelivered: "Đã nhận được hàng",
          },
        },
        {
          onSettled: () => {
            queryOrder.refetch();
          },
        }
      );
    }
  };

  const handleChangeOrder = (value) => {
    setStateOrder(value);

    if(value === "Đơn hàng đang thực hiện") {
      const listOrder = data?.data?.filter(item => (item.isDelivered === "Đang giao" ||  item.isDelivered === "Chưa giao hàng"));
      setListOrderFilter(listOrder);
    }else if(value === "Đơn đã hoàn thành"){
      const listOrder = data?.data?.filter(item => (item.isDelivered === "Đã nhận được hàng"));
      setListOrderFilter(listOrder);
    }else {
      setListOrderFilter(data?.data);
    }
    
  };

  return (
    <Loading isLoading={isLoadingOrder || isLoadingCancel || isLoadingUpdate}>
    
      <div style={{textAlign: "center", marginTop: "10px"}}>

      <Select
        value={stateOrder}
        onChange={handleChangeOrder}
        className="allorder"
        options={[
          { value: "Tất cả đơn hàng", label: "Tất cả đơn hàng" },
          {
            value: "Đơn hàng đang thực hiện",
            label: "Đơn hàng đang thực hiện",
          },
          { value: "Đơn đã hoàn thành", label: "Đơn đã hoàn thành" },
        ]}
      />
      </div>

      <main className="myorder">
        {listOrderFilter?.map((item, index) => {
          return (
            <div className="myorder__item" key={index}>
              <div className="myorder__item__state">
                <h1>Trạng thái</h1>
                <span>
                  <span style={{ color: "red" }}>Đặt hàng lúc: </span>
                  {formatDateTime(item?.createdAt)}
                </span>
                <span>
                  <span style={{ color: "red" }}>Tình trạng giao hàng: </span>
                  {item?.isDelivered}
                </span>
                <span>
                  <span style={{ color: "red" }}>Thanh toán: </span>
                  {!item?.isPaid ? "Chưa thanh toán" : "Đã thanh toán"}
                </span>

                {item?.isDelivered === "Đã nhận được hàng" && (
                  <span>
                    <span style={{ color: "red" }}>Nhận được hàng lúc: </span>
                    {formatDateTime(item?.updatedAt)}
                  </span>
                )}
              </div>

              {item?.orderItems.map((order, i) => {
                return (
                  <div className="myorder__item__listorder" key={i}>
                    <div className="myorder__item__listorder__left">
                      <span className="myorder__item__listorder__left--img">
                        <img src={order?.image} />
                      </span>
                      <span className="myorder__item__listorder__left--name">
                        {order?.name}
                      </span>
                    </div>
                    <div className="myorder__item__listorder__right">
                      <span>{`X ${order?.amount}`}</span>
                      <span>{order?.price}</span>
                    </div>
                  </div>
                );
              })}

              <div className="myorder__item__feature">
                <div className="myorder__item__feature--totalprice">
                  <span style={{ color: "red" }}>Tổng tiền: </span>
                  {numberToString(item?.totalPrice)}
                </div>
                <div className="myorder__item__feature__button">
                  {item?.isDelivered !== "Chưa giao hàng" || (
                    <div
                      className="myorder__item__feature__button--cancel"
                      onClick={() =>
                        handleCancelOrder(item?._id, item?.orderItems)
                      }
                    >
                      Hủy đơn hàng
                    </div>
                  )}

                  <>
                    <Modal
                      title="Xác nhận hủy đơn hàng"
                      open={isModalOpenDelete}
                      onOk={handleOkDelete}
                      onCancel={handleCancelDelte}
                    >
                      Bạn có chắn chắn muốn xóa
                    </Modal>
                  </>
                  <div
                    className="myorder__item__feature__button--detailorder"
                    onClick={() => handleDetailOrder(item?._id)}
                  >
                    Xem chi tiết
                  </div>
                  {item?.isDelivered !== "Đã nhận được hàng" && (
                    <div
                      className="myorder__item__feature__button--delivery"
                      onClick={() =>
                        handleUpdateDelivery(item?._id, item?.isDelivered)
                      }
                      style={{ backgroundColor: "green" }}
                    >
                      Đã nhận được hàng và thanh toán
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </Loading>
  );
}

export default MyOrder;
