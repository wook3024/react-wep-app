import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";
import axios from "axios";

import Tooltip from "antd/lib/tooltip";
import message from "antd/lib/message";
import Input from "antd/lib/input";
import Form from "antd/lib/form";
import Button from "antd/lib/button";
import Checkbox from "antd/lib/checkbox";
import Select from "antd/lib/select";
import InputNumber from "antd/lib/input-number";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

let formUserInfo = undefined;

const SignUp = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  let history = useHistory();

  const onFinish = async (values) => {
    setLoading(true);
    formUserInfo = await values;

    await axios({
      method: "post",
      url: "http://localhost:8080/user/signup",
      params: formUserInfo,
    })
      .then((res) => {
        if (!res.data.fulfillmentValue) {
          formUserInfo = undefined;
          message.success("Sign Up Complete. Go to the main page! 🐳");
          history.push("/signin");
        } else {
          message.warning("This user already exists. 😱");
        }
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
    setLoading(false);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="82">+82</Option>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Form
      style={{
        float: "none",
        margin: "15rem auto",
        width: 450,
      }}
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        prefix: "82",
      }}
      scrollToFirstError
    >
      <Form.Item
        name="username"
        label="username"
        rules={[
          // {
          //   type: "email",
          //   message: "The input is not valid E-mail!"
          // },
          {
            required: true,
            message: "Please input your name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                "The two passwords that you entered do not match!"
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="nickname"
        label={
          <span>
            Nickname&nbsp;
            <Tooltip title="What do you want others to call you?">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[
          {
            required: true,
            message: "Please input your nickname!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="age"
        label={<span>Age&nbsp;</span>}
        rules={[
          {
            type: "number",
            min: 0,
            max: 99,
            required: true,
            // message: "Please input your age!",
            // whitespace: false,
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[{ required: true, message: "Please input your phone number!" }]}
      >
        <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject("Should accept agreement"),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have read the <a href="/">agreement</a>
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button loading={loading} type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignUp;
