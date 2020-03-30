import React, { useState, useEffect } from "react";
import { Row, Input, Button, Form, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Span = styled.span``;

let getLoginInfo = {};

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [loginState, setLoginState] = useState(true);

  let history = useHistory();

  useEffect(() => {
    const loginCheck = axios({
      method: "post",
      url: `http://localhost:8080/user/signincheck`
    });
    loginCheck.then(res => {
      console.log("loginCheck", res);
    });
  }, []);

  const onFinish = async values => {
    setLoading(true);
    let loginInfo = await values;
    console.log("Success:", loginInfo);

    getLoginInfo = await axios({
      method: "post",
      url: "http://localhost:8080/user/signin",
      params: {
        ...loginInfo
      },
      credentials: "include",
      withCredentials: true
    });
    getLoginInfo = getLoginInfo.data;

    if (getLoginInfo && getLoginInfo.username) {
      alert("Log In Complete. Go to the main page");
      return history.push("/");
    } else {
      setLoginState(false);
    }

    // if (getLoginInfo.username === undefined || !loginCheck) {
    //   setLoginState(false);
    // }

    // return dispatch({
    //   type: LOG_IN_ACTION,
    //   payload: loginInfo
    // });
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
