import { useState, useEffect } from "react";
import "./SignIn.scss";
import { jwtDecode } from "jwt-decode";
import { Button, Checkbox, Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate,useLocation } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import * as UserService from "../../services/UserService";
import * as message from "../../components/Message/Message";
import { setUserInfor } from "../../redux/action";
import { useDispatch } from "react-redux";

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      return UserService.loginUser(data);
    },
  });

  const { data, isPending } = mutation;

  useEffect(() => {
    if (data?.status === "OK") {
      if(location?.state) {
        navigate(location?.state);
      }else{
        navigate("/");
      }
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      console.log(data);
      message.success("Đăng nhập thành công");
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);

        if (decoded?.id) {
          handleGetDetailUser(decoded?.id, data?.access_token);
        }
      }
    }
  }, [data?.status]);

  const handleGetDetailUser = async (id, access_token) => {
    const res = await UserService.getDetailsUser(id, access_token);
    dispatch(setUserInfor({ ...res?.data, access_token: access_token }));
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleSubmit = () => {
    const email = formData.email;
    const password = formData.password;

    mutation.mutate({
      email,
      password,
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{}}
      initialValues={{
        remember: true,
      }}
      onFinish={handleSubmit}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <h1 style={{ textAlign: "center", marginBottom: "15px" }}>Đăng nhập</h1>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập email",
          },
        ]}
      >
        <Input name="email" value={formData.email} onChange={handleChange} />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mật khẩu",
          },
        ]}
      >
        <Input.Password
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </Form.Item>

      {data?.status === "ERR" && (
        <div style={{ width: "100%", textAlign: "center" }}>
          {data?.message}
        </div>
      )}

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
        style={{ marginBottom: "0" }}
      >
        <Checkbox
          name="remember"
          checked={formData.remember}
          onChange={handleChange}
        >
          Remember me
        </Checkbox>
        <a className="forgetpassword" onClick={() => navigate("/forget-password")}>Quên mật khẩu</a>
      </Form.Item>

      <Loading isLoading={isPending}>
        <Button
          type="primary"
          htmlType="submit"
          style={
            !formData.password || !formData.email
              ? { backgroundColor: "grey" }
              : { backgroundColor: "#ff7235" }
          }
        >
          Đăng nhập
        </Button>
      </Loading>
      <a onClick={() => navigate("/sign-up")}>Bạn chưa có tài khoản</a>
    </Form>
  );
}

export default SignIn;
