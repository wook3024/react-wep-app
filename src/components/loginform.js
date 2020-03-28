import React, { useState } from "react";
import { Row, Input, Button, Form, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styled from "styled-components";

const Span = styled.span``;

const tempUsername = "asdf";
const tempPassword = "asdf";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  const [loginState, setloginState] = useState(true);

  const onFinish = async values => {
    values = await values;
    console.log("Success:", values);

    if (values.username === tempUsername && values.password === tempPassword) {
      setLoginCheck(true);
      setloginState(true);
    } else {
      setloginState(false);
    }

    if (loginCheck === true) {
      //go to mainscreen
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // const onFinishFailed = errorInfo => {
  //   console.log("Failed:", errorInfo);
  // };

  return (
    <Row>
      <Form
        style={{
          display: "inline-block",
          margin: "1.5rem 0 0 1.5rem"
        }}
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        {!loginState && (
          <Span style={{ color: "red" }}>Please check login info</Span>
        )}
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="/">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            Log in
          </Button>{" "}
          Or <a href="/">register now!</a>
        </Form.Item>
      </Form>
    </Row>
  );
};

export default LoginForm;
