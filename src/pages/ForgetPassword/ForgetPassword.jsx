import { useState, useEffect } from "react";
import "./ForgetPassword.scss";
import { Button, Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import * as UserService from "../../services/UserService";
import * as message from "../../components/Message/Message";

function ForgetPassword() {
  const navigate = useNavigate();
  const [email,setEmail] = useState("");

  const mutationForgetPassword = useMutation({
    mutationFn: (emailChangePassword) => {
      return UserService.forgetPassword(emailChangePassword);
    },
  });

  const { data, isPending } = mutationForgetPassword;

  useEffect(()=>{
    if(data?.status === "OK"){
        message.success(data?.message);
        navigate("/sign-in");
    }
  },[data])

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    mutationForgetPassword.mutate(email);
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
      initialValues={{
        remember: true,
      }}
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <h1 style={{ textAlign: "center", marginBottom: "15px" }}>Đặt lại mật khẩu</h1>
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
        <Input name="email" value={email} onChange={handleChange} />
      </Form.Item>

      {data?.status === "ERR" && (
        <div style={{ width: "100%", textAlign: "center",color: "red" }}>
          {data?.message}
        </div>
      )}

      <Loading isLoading={isPending}>
        <Button
          type="primary"
          htmlType="submit"
          style={
            !email
              ? { backgroundColor: "grey" }
              : { backgroundColor: "#ff7235" }
          }
        >
          Gửi đến email
        </Button>
      </Loading>
      <a href="/sign-in">Quay lại</a>
    </Form>
  );
}

export default ForgetPassword;
