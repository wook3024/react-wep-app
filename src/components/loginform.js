import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { Input, Button, Form, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";

import { LOG_IN_ACTION } from "../reducers/actions";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [loginState, setLoginState] = useState(true);
  const { userInfo } = useSelector((state) => state);

  let history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo.username) {
      message.success("Log In Complete. Go to the main page");
      return history.push("/main");
    }
  }, [history, userInfo.username]);

  const onFinish = async (values) => {
    setLoading(true);

    let loginInfo = await values;
    loginInfo = {
      ...loginInfo,
      username: loginInfo.username.trim(),
      password: loginInfo.password.trim(),
    };
    console.log("Success:", loginInfo);

    await axios({
      method: "post",
      url: "/user/signin",
      params: {
        ...loginInfo,
      },
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.username) {
          return dispatch({
            type: LOG_IN_ACTION,
            payload: res.data,
          });
        } else {
          setLoginState(false);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("😡 ", error);
        setLoading(false);
        setLoginState(false);
        message.error("Server error! 😡");
      });
  };

  return (
    <Form
      style={{
        float: "none",
        margin: "15rem auto",
        width: 300,
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
        <span style={{ color: "red" }}>Please check login info</span>
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
        Or <Link to="/signup">register now!</Link>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
