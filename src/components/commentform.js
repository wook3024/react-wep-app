import React from "react";
import { Input, Form, Button } from "antd";

const { TextArea } = Input;

const Commentform = () => {
  return (
    <Form>
      <TextArea
        rows={4}
        style={{
          margin: "0 0 0.5rem 0",
          width: "300px",
          display: "block"
        }}
      />
      <Button type="primary">submit</Button>
    </Form>
  );
};

export default Commentform;
