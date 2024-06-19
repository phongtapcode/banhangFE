import { useEffect, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import Loading from "../../components/Loading/Loading";
import * as UserService from "../../services/UserService";
import * as message from "../../components/Message/Message";

function ResetPassword() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      return UserService.resetPassword(data);
    },
  });

  const { data, isPending } = mutation;

  useEffect(() => {
    if (data?.status === "OK") {
      message.success(data?.message);
      navigate("/sign-in");
    }
  }, [data?.status]);

  const handleSubmit = () => {
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if(password === confirmPassword){
      mutation.mutate({
        email,
        token,
        password
      });
    }else{
      message.error("Mật khẩu xác nhận không đúng");
    }
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
      style={{
        maxWidth: 1000,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <h1 style={{ textAlign: "center", marginBottom: "15px" }}>
        Đổi mật khẩu
      </h1>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mật khẩu",
          },
        ]}
      >
        <Input.Password
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item
        label="Nhập lại mật khẩu"
        name="confirmPassword"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập lại mật khẩu",
          },
        ]}
      >
        <Input.Password
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </Form.Item>

      {data?.status === "ERR" && (
        <div style={{ width: "100%", textAlign: "center" }}>
          {data?.message}
        </div>
      )}

      <Loading isLoading={isPending}>
        <Button
          type="primary"
          htmlType="submit"
          style={
            !formData.confirmPassword || !formData.password || !formData.email
              ? { backgroundColor: "grey" }
              : { backgroundColor: "blue" }
          }
        >
          Xác nhận
        </Button>
      </Loading>
    </Form>
  );
}

export default ResetPassword;
