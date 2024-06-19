import "./ItemComment.scss";
import { DeleteOutlined } from "@ant-design/icons";

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString(); // Sử dụng toLocaleString() để chuyển đổi thành chuỗi ngày giờ đọc hiểu được bởi người dùng
};

function ItemComment({ data, onClickDeleteComment, idUser }) {
  console.log(idUser, data?.idUser);
  const handleDeleteComment = (id) => {
    onClickDeleteComment(id);
  };

  return (
    <div className="itemcomment">
      <div className="itemcomment__img">
        <img src={data?.idUser.avatar} />
      </div>

      <div className="itemcomment__comment">
        <div className="itemcomment__comment__name">
          {data?.idUser.name}
          <span>{` (${formatDateTime(data.createdAt)})`}</span>

          {idUser === data?.idUser._id && (
            <DeleteOutlined
              style={{ fontSize: "20px", color: "red", cursor: "pointer" }}
              onClick={() => handleDeleteComment(data?._id)}
            />
          )}
        </div>
        <div className="itemcomment__comment__text">
          <span>{data?.comment}</span>
        </div>
      </div>
    </div>
  );
}

export default ItemComment;
