import "./AdminOrder.scss";
import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Product from "./components/Product/Product";
import {
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal, Input, Space, Select } from "antd";
import Highlighter from "react-highlight-words";
import TableComponent from "../TableComponent/TableComponent";
import Loading from "../Loading/Loading";

function numberToString(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString(); // Sử dụng toLocaleString() để chuyển đổi thành chuỗi ngày giờ đọc hiểu được bởi người dùng
};

function AdminOrder() {
  const user = useSelector((state) => state?.dataUser);
  const [rowSelected, setRowSelected] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isLoadingOrder,setIsLoadingOrder] = useState(false);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={`${selectedKeys[0] || ""}`}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const renderAction = () => {
    return (
      <>
        <EyeOutlined
          style={{
            fontSize: "20px",
            marginRight: "10px",
            color: "green",
            cursor: "pointer",
          }}
          onClick={() => {
            handleDetailOrder();
          }}
        />
      </>
    );
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "userName",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "phone",
      dataIndex: "phone",
    },
    {
      title: "Thanh toán",
      dataIndex: "paided",
    },
    {
      title: "Tình trạng giao",
      dataIndex: "shipped",
      render: (text) => <a style={text === "Đã nhận được hàng" ? {color: "green"} : {color: "red"}}>{text}</a>,
      filters: [{text: "Đã nhận được hàng",value: "Đã nhận được hàng"},{text: "Đang giao",value: "Đang giao"},{text: "Chưa giao hàng",value: "Chưa giao hàng"}],
      onFilter: (value, record) => record.shipped.startsWith(value),
    },
    {
      title: "TotalPrice",
      dataIndex: "totalPrice",
    },
    {
      title: "Action",
      render: renderAction,
    },
  ];

  const fetchOrderAll = async () => {
    setIsLoadingOrder(true);
    const res = await OrderService.getAllOrder(user?.access_token);
    setIsLoadingOrder(false);
    return res;
  };

  //retry: Xác định số lần thử lại khi có lỗi xảy ra khi gọi API.
  const queryOrder = useQuery({
    queryKey: ["order"],
    queryFn: fetchOrderAll, // Sử dụng queryFn để truyền hàm lấy dữ liệu
    config: { retry: 3, retryDelay: 1000 },
  });
 
  const { data } = queryOrder;

  const dataTable = data?.data.map((order) => {
    return {
      key: order?._id,
      userName: order.shippingAddress.fullName,
      phone: order.shippingAddress.phone,
      totalPrice: numberToString(order.totalPrice),
      paided: !order.isPaid ? "False" : "True",
      shipped: order.isDelivered,
      orderItems: order?.orderItems,
      paymentMethod: order?.paymentMethod,
      address: order.shippingAddress.address,
      createdAt: order?.createdAt
    };
  });

  const handleDetailOrder = () => {
    setIsModalOpenDetail(true);
  };

  const handleCancelDetailOrder = () => {
    setIsModalOpenDetail(false);
  };

  const handleOkUpdateOrder = () => {
    setIsModalOpenDetail(false);
  };
  
  const mutationUpdate = useMutation({
    mutationFn: (dataUpdateOrder) => {
      const { token, id, data } = dataUpdateOrder;
      return OrderService.updateOrder(token, id, data);
    },
  });
  const {isPending: isLoadingUpdateDeliverd} = mutationUpdate;
 
  const handleUpdateDelivery = (value) => {
    mutationUpdate.mutate(
      {
        token: user?.access_token,
        id: rowSelected.key,
        data: {
          isDelivered: value,
        },
      },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
    setIsModalOpenDetail(false);
  };

  return (
    <Loading isLoading={isLoadingUpdateDeliverd || isLoadingOrder}>
    <div className="adminproduct">
      <h1>Danh sách hóa đơn</h1>
      <>
        <Modal
          title="Chi tiết đơn hàng"
          open={isModalOpenDetail}
          onOk={handleOkUpdateOrder}
          onCancel={handleCancelDetailOrder}
        >
          <div className="order">
            <div className="order__address">
              <span>{`Tên người nhận: ${rowSelected?.userName}`}</span>
              <span>{`Số điện thoại: ${rowSelected?.phone}`}</span>
              <span>{`Địa chỉ người nhận: ${rowSelected?.address}`}</span>
            </div>
            <div className="order__listorder">
              {rowSelected?.orderItems?.map((product, index) => (
                <Product
                  key={index}
                  image={product?.image}
                  name={product?.name}
                  amount={product?.amount}
                />
              ))}
            </div>
            <div className="order__payment">
            <span>{`Thời gian đặt đơn: ${formatDateTime(rowSelected?.createdAt)}`}</span>
              <span>{`Hình thức khi thanh toán: ${rowSelected?.paymentMethod}`}</span>
              <div>Trạng thái giao:
                <Select 
                  value={rowSelected?.shipped}
                  onChange={handleUpdateDelivery}
                  className="selectstate"
                  options={[{value: "Chưa giao hàng", label: "Chưa giao hàng"},{value: "Đang giao", label: "Đang giao"},{value: "Đã nhận được hàng", label: "Đã nhận được hàng"}]}
                />
              </div>
              <span>{`Tổng tiền: ${rowSelected?.totalPrice}`}</span>
            </div>
          </div>
        </Modal>
      </>
      <div>
        <TableComponent
          columns={columns}
          dataTable={dataTable}
          onRow={(record) => {
            return {
              onClick: () => {
                setRowSelected(record);
              },
            };
          }}
        />
      </div>
    </div>
    </Loading>
  );
}

export default AdminOrder;
