import React, { useState, useEffect } from "react";
import { Row, Input, Button, Form, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { LOG_IN_ACTION } from "../reducers/actions";
import axios from "axios";

const Span = styled.span``;

let loginInfo = {};
let getLoginInfo = {};

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [loginState, setloginState] = useState(true);
  let { loginCheck } = useSelector(state => state);

  let history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    //쿠키로도 로그인 여부 확인
    if (loginCheck) {
      alert("Log In Complete. Go to the main page");
      return history.push("/");
    }
  }, [history, loginCheck]);

  const onFinish = async values => {
    loginInfo = await values;
    // console.log("Success:", loginInfo);

    getLoginInfo = await axios({
      method: "get",
      url: `http://localhost:8080/user/signin`,
      params: {
        ...loginInfo
      }
    });

    getLoginInfo =
      getLoginInfo.data.users && getLoginInfo.data.users.fulfillmentValue[0];
    console.log("axios Check", getLoginInfo);

    if (getLoginInfo !== null && !loginCheck) {
      setloginState(false);
    }

    return dispatch({
      type: LOG_IN_ACTION,
      payload: getLoginInfo
    });
    // if (
    //   loginInfo.username === getLoginInfo.username &&
    //   loginInfo.password === getLoginInfo.password
    // ) {
    //   alert("login Success!", getLoginInfo);
    //   return history.push("/");
    // } else {

    // }

    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 1000);
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
