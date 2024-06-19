import "./AdminUser.scss";
import { useEffect, useState, useRef } from "react";
import { getBase64 } from "../../utils";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import * as UserService from "../../services/UserService";
import { Button, Upload, Image, Modal, Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import TableComponent from "../TableComponent/TableComponent";
import * as message from "../Message/Message";
import Loading from "../Loading/Loading";

function AdminUser() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state?.dataUser);
  const [loadingDetail,setLoadingDetail] = useState(true);
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [userInfor, setUserInfor] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: "",
    address: "",
    avatar: ""
  });
  const [searchText, setSearchText] = useState("");
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const mutationUpdate = useMutation({
    mutationFn: (dataUsertUpdate) => {
      const { id, token, ...rest } = dataUsertUpdate;
      return UserService.updateUser(id,token,rest);
    }
  });

  useEffect(() => {
    if (mutationUpdate.data?.status === "OK") {
      message.success("Sửa khách hàng thành công");
      setIsModalOpen(false);
    }else if(mutationUpdate.data?.status === "ERR"){
      message.error(mutationUpdate.data?.message);
    }
  }, [mutationUpdate.isSuccess]);

  const fetchGetDetaiUser = async (id) => {
    setLoadingDetail(true);
    setRowSelected(id);
    const res = await UserService.getDetailsUser(id,user?.access_token);
    setUserInfor({      
      name: res?.data?.name || "",
      email: res?.data?.email ,
      phone: res?.data?.phone || "",
      isAdmin: res?.data?.isAdmin,
      address: res?.data?.address || "",
      avatar: res?.data?.avatar || ""
    });
    setLoadingDetail(false);
  };

  const renderAction = () => {
    return (
      <>
        <EditOutlined
          style={{
            fontSize: "20px",
            marginRight: "10px",
            color: "green",
            cursor: "pointer",
          }}
          onClick={() => {
            showModal();
          }}
        />
        <DeleteOutlined
          style={{ fontSize: "20px", color: "red", cursor: "pointer" }}
          onClick={handleDeleteUser}
        />
      </>
    );
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Action",
      render: renderAction,
    },
  ];

  const handleOk = () => {
      mutationUpdate.mutate(
        { id: rowSelected, token: user?.access_token, ...userInfor },
        {
          onSettled: () => {
            queryUser.refetch();
          },
        }
      );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchUserAll = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };

  //retry: Xác định số lần thử lại khi có lỗi xảy ra khi gọi API.
  const queryUser = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserAll, // Sử dụng queryFn để truyền hàm lấy dữ liệu
    config: { retry: 3, retryDelay: 1000 },
  });

  const { data ,isLoading: isLoadingAllUsser } = queryUser;

  const dataTable = data?.data.map((user) => {
    return { ...user, key: user._id,isAdmin: user.isAdmin ? "TRUE": "FALSE" };
  });

  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[fileList.length - 1];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setUserInfor({ ...userInfor, ["avatar"]: file.preview });
  };

  const handleOnChange = (e) => {
    setUserInfor({
      ...userInfor,
      [e.target.name]: e.target.value,
    });
  };

  const mutationDelete = useMutation({
    mutationFn: (dataUserDelete) => {
      const { id, token } = dataUserDelete;
      return UserService.deleteUser(id, token);
    },
  });

  useEffect(() => {
    if (mutationDelete.data?.status === "OK") {
      message.success("Xóa sản phẩm thành công");
    }
  }, [mutationDelete.isSuccess]);

  const handleDeleteUser = () => {
    setIsModalOpenDelete(true);
  };

  const handleOkDelete = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  return (
    <Loading isLoading={isLoadingAllUsser}>
    <div className="adminproduct">
      <h1>Danh sách khách hàng</h1>
      <>
        <Modal
          title={`Sửa người dùng`}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText={"Sửa"}
        >
          <Loading
            isLoading={loadingDetail || mutationUpdate.isPending}
          >
            <div className="modal__item">
              <label>Tên</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleOnChange}
                value={userInfor.name}
              />
            </div>
            
            <div className="modal__item">
              <label>Email</label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                onChange={handleOnChange}
                value={userInfor.email}
              />
            </div>
            <div className="modal__item">
              <label>Admin</label>
              <input
                type="text"
                name="isAdmin"
                value={userInfor.isAdmin}
              />
            </div>
            <div className="modal__item">
              <label>phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                onChange={handleOnChange}
                value={userInfor.phone}
              />
            </div>
            <div className="modal__item">
              <label>Address</label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                onChange={handleOnChange}
                value={userInfor.address}
              />
            </div>
            <Upload onChange={handleOnChangeAvatar} className="uploadfile">
              <label style={{ width: "110px" }}>Ảnh</label>
              <Button icon={<UploadOutlined />} className="buttonupload">
                Upload
              </Button>
            </Upload>
            <div className="imgproduct">
              <Image src={userInfor.avatar} />
            </div>
          </Loading>
        </Modal>
      </>

      <>
        <Modal
          title="Basic Modal"
          open={isModalOpenDelete}
          onOk={handleOkDelete}
          onCancel={handleCancelDelete}
        >
          Bạn có chắn chắn muốn xóa
        </Modal>
      </>

      <div>
        <TableComponent
          columns={columns}
          dataTable={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                setRowSelected(record._id);
                fetchGetDetaiUser(record._id);
              },
            };
          }}
        />
      </div>
    </div>
    </Loading>
  );
}

export default AdminUser;
