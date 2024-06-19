import { useEffect, useState } from "react";
import "./ProfilePage.scss";
import InputUpdate from "./components/InputUpdate/InputUpdate";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import * as UserService from "../../services/UserService";
import * as message from "../../components/Message/Message";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, Image } from "antd";
import { setUserInfor } from "../../redux/action";
import { getBase64 } from "../../utils";
import { useDispatch } from "react-redux";

const dataInput = [
  {
    title: "Name",
    classIcon: "fa-solid fa-signature",
    name: "name",
  },
  {
    title: "Email",
    classIcon: "fa-regular fa-envelope",
    name: "email",
  },
  {
    title: "Phone",
    classIcon: "fa-solid fa-phone",
    name: "phone",
  },
  {
    title: "Address",
    classIcon: "fa-solid fa-location-dot",
    name: "address",
  },
];

function ProfilePage() {
  const dispatch = useDispatch();
  const dataUser = useSelector((state) => state.dataUser);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    avatar: dataUser.avatar || "",
    name: dataUser.name || "",
    email: dataUser.email || "",
    phone: dataUser.phone || "",
    address: dataUser.address || "",
  });

  useEffect(() => {
    if (dataUser?.id) {
      handleGetDetailUser(dataUser.id, dataUser.access_token);
    }
    setUser({
      avatar: dataUser.avatar || "",
      name: dataUser.name || "",
      email: dataUser.email || "",
      phone: dataUser.phone || "",
      address: dataUser.address || "",
    });
  }, [dataUser]);
 
  const handleChangeInput = (name, value) => {
    setUser({
      ...user,
      [name]: value,
    });
  };3

  const handleUpdateUser = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const res = await UserService.updateUser(dataUser.id,dataUser.access_token ,user);
    handleGetDetailUser(dataUser.id, dataUser.access_token);
    res?.status === "OK"
      ? message.success("Cập nhật thành công")
      : message.success("Cập nhật thất bại");
    setIsLoading(false);
  };

  const handleGetDetailUser = async (id, access_token) => {
    const res = await UserService.getDetailsUser(id, access_token);
    dispatch(setUserInfor({ ...res?.data, access_token: access_token }));
  };

  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[fileList.length - 1];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setUser({ ...user, ["avatar"]: file.preview });
  };

  return (
    <form className="profile">
      <div className="imgprofile">
      {user.avatar && <Image src={user.avatar}/>}
      </div>
      <Upload onChange={handleOnChangeAvatar}>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>

      {dataInput.map((item, index) => (
        <InputUpdate
          key={index}
          title={item.title}
          classIcon={item.classIcon}
          name={item.name}
          onChange={handleChangeInput}
          value={user[item.name]}
        />
      ))}

      <Loading isLoading={isLoading}>
        <button className="button__update" onClick={handleUpdateUser}>Cập nhật</button>
      </Loading>
    </form>
  );
}

export default ProfilePage;
