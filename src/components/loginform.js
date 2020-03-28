import React, { useState, useEffect } from "react";
import { Row, Input, Button, Form, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Span = styled.span``;

let loginInfo = {};

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [loginState, setloginState] = useState(true);
  let { userInfo } = useSelector(state => state);

  let history = useHistory();

  useEffect(() => {
    //쿠키로 로그인 여부 확인
  }, [history, userInfo]);

  const onFinish = async values => {
    loginInfo = await values;
    // console.log("Success:", loginInfo);

    if (userInfo && userInfo.username) {
      if (
        loginInfo.username === userInfo.username &&
        loginInfo.password === userInfo.password
      ) {
        // console.log("login Success!", userInfo);
        setloginState(false);
        alert("Log In Complete. Go to the main page");
        return history.push("/");
      } else {
        setloginState(false);
      }
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

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
