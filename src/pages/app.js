import React, { useState, useEffect, Suspense, useCallback } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Row, Col, Menu, Input, Button } from "antd";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";

import "./App.css";
import Index from "./index";
import Profile from "./profile";
import SignUp from "./signup";

const { SubMenu } = Menu;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = e => {
    console.log("click ", e);
  };

  const onChangeId = useCallback(e => {
    setId(e.target.value);
  }, []);

  const onChangePassword = useCallback(e => {
    setPassword(e.target.value);
  }, []);

  const submitForm = () => {
    console.log("id", id);
    console.log("password", password);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Menu onClick={handleClick} mode="horizontal">
        <SubMenu
          title={
            <span className="submenu-title-wrapper">
              <SettingOutlined />
              Navigation Three - Submenu
            </span>
          }
        >
          <Menu.ItemGroup title="Item 1">
            <Menu.Item key="setting:1">Option 1</Menu.Item>
            <Menu.Item key="setting:2">Option 2</Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup title="Item 2">
            <Menu.Item key="setting:3">Option 3</Menu.Item>
            <Menu.Item key="setting:4">Option 4</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>
        <Menu.Item key="mail">
          <AppstoreOutlined />
          Profile
        </Menu.Item>
        <Menu.Item key="app">
          <AppstoreOutlined />
          Sign Up
        </Menu.Item>
      </Menu>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Route path="/index" component={Index} />
          <Route path="/profile" component={Profile} />
          <Route path="/signUp" component={SignUp} />
        </Suspense>
      </Router>
      <Row gutter={[8, 12]} style={{ margin: "50px 0 0 0" }}>
        <Col span={5}>
          <div className="example-input">
            <Input onChange={onChangeId} placeholder="id" />
          </div>
        </Col>
      </Row>
      <Row gutter={[8, 12]}>
        <Col span={5}>
          <div className="example-input">
            <Input.Password
              onChange={onChangePassword}
              size="default size"
              placeholder="password"
            />
          </div>
        </Col>
      </Row>
      <Row gutter={[8, 12]}>
        <Col span={5}>
          <Button type="primary" loading={loading} onClick={submitForm}>
            Sign In
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default App;
