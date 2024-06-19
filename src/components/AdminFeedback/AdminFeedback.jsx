import "./AdminFeedback.scss";
import { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import * as FeedbackService from "../../services/FeedbackService";
import { Button, Modal, Input, Space, Select } from "antd";
import Highlighter from "react-highlight-words";
import TableComponent from "../TableComponent/TableComponent";
import * as message from "../Message/Message";
import Loading from "../Loading/Loading";

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString(); // Sử dụng toLocaleString() để chuyển đổi thành chuỗi ngày giờ đọc hiểu được bởi người dùng
};

function AdminFeedback() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isLoadingAllFeedback, setIsLoadingAllFeedback] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [detailFeedback, setDetailFeedback] = useState({});
  const [loadingDetail, setLoadingDetail] = useState(false);
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
    mutationFn: (dataProductUpdate) => {
      const { id, data} = dataProductUpdate;
      return FeedbackService.updateFeedback(id, data);
    },
  });

  useEffect(() => {
    if (mutationUpdate.data?.status === "OK") {
      message.success("Sửa sản phẩm thành công");
      setIsModalOpen(false);
    } else if (mutationUpdate.data?.status === "ERR") {
      message.error(mutationUpdate.data?.message);
    }
  }, [mutationUpdate.isSuccess]);

  const fetchGetDetaiFeedback = async (id) => {
    setLoadingDetail(true);
    setRowSelected(id);
    const res = await FeedbackService.getFeedbackDetail(id);
    setDetailFeedback(res?.data);
    setLoadingDetail(false);
    return res;
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
          onClick={handleDeleteProduct}
        />
      </>
    );
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "nameUser",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (text) => <a>{formatDateTime(text)}</a>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (text) => <a style={text === "Chưa xử lí" ? {color: "red"} : {color: "green"}}>{text}</a>,
      filters: [
        { text: "Chưa xử lí", value: "Chưa xử lí" },
        { text: "Đã xử lí", value: "Đã xử lí" },
      ],
      onFilter: (value, record) => record.status.startsWith(value),
    },
    {
      title: "Action",
      render: renderAction,
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchFeedbackAll = async () => {
    setIsLoadingAllFeedback(true);
    const res = await FeedbackService.getAllFeedback();
    setIsLoadingAllFeedback(false);
    return res;
  };

  //retry: Xác định số lần thử lại khi có lỗi xảy ra khi gọi API.
  const queryFeedback = useQuery({
    queryKey: ["feedback"],
    queryFn: fetchFeedbackAll, // Sử dụng queryFn để truyền hàm lấy dữ liệu
    config: { retry: 3, retryDelay: 1000 },
  });

  const { data } = queryFeedback;

  const dataTable = data?.data.map((feedback) => {
    return { ...feedback, key: feedback._id };
  });

  const mutationDelete = useMutation({
    mutationFn: (id) => {
      return FeedbackService.deleteFeedback(id);
    },
  });

  useEffect(() => {
    if (mutationDelete.data?.status === "OK") {
      message.success("Xóa feedback thành công");
    }
  }, [mutationDelete.isSuccess]);

  const handleDeleteProduct = () => {
    setIsModalOpenDelete(true);
  };

  const handleOkDelete = () => {
    mutationDelete.mutate(
       detailFeedback?._id ,
      {
        onSettled: () => {
          queryFeedback.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
  };

  const handleCancelDelte = () => {
    setIsModalOpenDelete(false);
  };

  const handleChangeStatus = (value) => {
    mutationUpdate.mutate(
        {
          id: detailFeedback?._id,
          data: {
              status: value,
          }
        },
        {
          onSettled: () => {
            queryFeedback.refetch();
          },
        }
      );
    //   setIsModalOpenDetail(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  console.log(rowSelected);

  return (
    <Loading isLoading={isLoadingAllFeedback}>
      <div className="adminproduct">
        <h1>FeedBack của người dùng</h1>
        <>
          <Modal
            title={`Chi tiết feedback`}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Loading isLoading={mutationUpdate.isPending || loadingDetail}>
              <div className="feedback">
                <div className="feedback__title">Người tạo</div>
                <div className="feedbackuser">
                  <div className="feedbackuser__img">
                    <img src={detailFeedback?.idUser?.avatar} />
                  </div>
                  <span>{detailFeedback?.idUser?.name}</span>
                </div>

                <div className="feedback__infortitle">Nội dung</div>    

                <div className="feedback__infor">
                  <span>{`Name: ${detailFeedback?.nameUser}`}</span>
                  <span>{`Email: ${detailFeedback?.emailUser}`}</span>
                  <span>{`Ngày tạo: ${formatDateTime(
                    detailFeedback?.createdAt
                  )}`}</span>
                  <div style={{fontSize: "15px"}}>
                    Trạng thái:
                    <Select
                      value={detailFeedback?.status}
                      onChange={handleChangeStatus}
                      style={{marginLeft: "10px"}}
                      options={[
                        { value: "Chưa xử lí", label: "Chưa xử lí" },
                        { value: "Đã xử lí", label: "Đã xử lí" },
                      ]}
                    />
                  </div>
                  <span style={{fontWeight: "700"}}>{`Tiêu đề: ${detailFeedback?.title}`}</span>
                  <span>Nội dung</span>
                  <p>{`${detailFeedback?.contentFeedback}`}</p>
                </div>
              </div>
            </Loading>
          </Modal>
        </>

        <>
          <Modal
            title="Basic Modal"
            open={isModalOpenDelete}
            onOk={handleOkDelete}
            onCancel={handleCancelDelte}
          >
            Bạn có chắn chắn muốn xóa
          </Modal>
        </>

        <div>
          <TableComponent
            columns={columns}
            dataTable={dataTable}
            onRow={(record) => {
              return {
                onClick: () => {
                  setRowSelected(record._id);
                  fetchGetDetaiFeedback(record._id);
                },
              };
            }}
          />
        </div>
      </div>
    </Loading>
  );
}

export default AdminFeedback;
