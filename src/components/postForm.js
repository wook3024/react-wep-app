import React, { useState } from "react";
import { Input, Button, Form } from "antd";

const { TextArea } = Input;

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onChangeTitle = e => {
    setContent(e.target.value);
  };
  const onChangeContent = e => {
    setTitle(e.target.value);
  };

  const onSubmit = e => {
    console.log("onSubmit", title, content);
  };

  return (
    <Form style={{ width: 300 }}>
      <Input placeholder="title" allowClear onChange={onChangeTitle} />
      <br />
      <br />
      <TextArea placeholder="content" allowClear onChange={onChangeContent} />
      <br />
      <br />
      <Button type="primary" htmlType="submit" onClick={onSubmit}>
        Submit
      </Button>
    </Form>
  );
};

export default PostForm;
