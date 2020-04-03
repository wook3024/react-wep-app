import React, { useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, Form, message, Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

import { GET_POST_DATA, UPDATE_POST_ACTION } from "../reducers/actions";

const { TextArea } = Input;

const formData = new FormData();

const PostForm = ({ postId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const { userInfo } = useSelector(state => state);

  const dispatch = useDispatch();

  const inputTitle = useRef(null);
  const inputContent = useRef(null);

  const getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleChange = ({ fileList }) => {
    formData.append("file", fileList[0].originFileObj);
    // console.log("files", e.target.files[0]);
    setFileList(fileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const onChangeTitle = e => {
    setContent(e.target.value);
  };
  const onChangeContent = e => {
    setTitle(e.target.value);
    console.log("postId", postId);
  };

  const updatePost = useCallback(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/post/update",
      params: {
        id: postId,
        title,
        content
      },
      withCredentials: true
    })
      .then(res => {
        console.log(res);

        dispatch({
          type: UPDATE_POST_ACTION,
          payload: { content, title, id: postId }
        });

        inputTitle.current.state.value = null;
        inputContent.current.state.value = null;
      })
      .catch(error => {
        console.error("😡 ", error);
      });
  }, [content, dispatch, postId, title]);

  const onSubmit = useCallback(async () => {
    if (postId !== undefined) {
      updatePost();
      return;
    }

    //axios({ }) 형태롤 사용하려고 했으나 쿼리 전달을 실패해 현재 형태로 사용
    axios
      .post("http://localhost:8080/post/upload", formData)
      .then(res => {
        alert("성공");
      })
      .catch(error => {
        alert("실패");
      });

    inputTitle.current.state.value = null;
    inputContent.current.state.value = null;

    if (!(userInfo && userInfo.username)) {
      message.warning("Login Please! 😱");
      return;
    }

    axios({
      method: "post",
      url: "http://localhost:8080/post/publish",
      params: {
        title,
        content
      },
      withCredentials: true
    }).then(async () => {
      axios({
        method: "get",
        url: "http://localhost:8080/post"
      })
        .then(postData => {
          dispatch({
            type: GET_POST_DATA,
            payload: postData.data
          });
        })
        .catch(error => {
          console.error("😡 ", error);
        });
    });
  }, [content, dispatch, postId, title, updatePost, userInfo]);

  return (
    <Form style={{ width: 300 }}>
      <Input
        placeholder="title"
        ref={inputTitle}
        allowClear
        onChange={onChangeContent}
      />
      <br />
      <br />
      <TextArea
        placeholder="content"
        ref={inputContent}
        allowClear
        onChange={onChangeTitle}
      />
      <br />
      <br />
      <div className="clearfix">
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
      {/* <input type="file" name="file" onChange={handleChange} /> */}
      <br />
      <br />
      <Button type="primary" htmlType="submit" onClick={onSubmit}>
        Submit
      </Button>
    </Form>
  );
};

export default PostForm;
