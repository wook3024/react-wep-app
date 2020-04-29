import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import PropTypes from "prop-types";

import { PUBLISH_POST_ACTION, UPDATE_POST_ACTION } from "../reducers/actions";
import message from "antd/lib/message";
import Input from "antd/lib/input";
import Form from "antd/lib/form";
import Button from "antd/lib/button";
import Upload from "antd/lib/upload";
import Modal from "antd/lib/modal";

import "antd/lib/message/style/css";
import "antd/lib/input/style/css";
import "antd/lib/button/style/css";
import "antd/lib/upload/style/css";
import "antd/lib/modal/style/css";

const moment = require("moment");
const { now } = moment;

const FormData = require("form-data");
const { TextArea } = Input;

const PostForm = ({ post = {} }) => {
  const [title, setTitle] = useState(post ? post.title : "");
  const [content, setContent] = useState(post ? post.content : "");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [postingState, setPostingState] = useState(false);

  const { userInfo } = useSelector((state) => state);

  const inputTitle = useRef(null);
  const inputContent = useRef(null);

  const dispatch = useDispatch();

  const formData = new FormData();

  useEffect(() => {
    console.log("post id check", post ? post.id : post, post);
    const imageList = [];
    if (post && post.images && post.images[0]) {
      post.images.forEach((image, index) => {
        let location = undefined;
        const imageName = [...image.location];
        for (const [i, c] of imageName.entries()) {
          // console.log("i, i", i, c, c === "_");
          if (c === "_") {
            location = image.location.slice(i + 1);
            console.log("location", location);
            break;
          }
        }
        //if(location 안넣으면 비동기로 인해 fileName이 섞인다.
        if (location) {
          toDataURL(image.location, function (dataUrl) {
            // console.log("RESULT:", dataUrl);
            var file = dataURLtoFile(dataUrl, location);
            imageList.push({
              uid: index - 3,
              status: "done",
              name: location,
              originFileObj: file,
              url: image.location,
            });
            if (imageList.length === post.images.length) {
              console.log("imageList check", imageList);
              if (imageList[0]) {
                setFileList(imageList);
              }
            }
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toDataURL = (url, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  };

  const dataURLtoFile = (dataurl, location) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], location, { type: mime });
  };

  const getBase64 = useCallback((file) => {
    console.log("getBase64", file);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }, []);

  const handleCancel = useCallback(() => setPreviewVisible(false), []);

  const handlePreview = useCallback(
    async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      setPreviewImage(file.url || file.preview);
      setPreviewVisible(true);
    },
    [getBase64]
  );

  const handleChange = useCallback(({ fileList }) => {
    console.log("filelist", fileList);
    setFileList(fileList);
  }, []);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const onChangeTitle = useCallback((e) => {
    setContent(e.target.value);
  }, []);
  const onChangeContent = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const updatePost = useCallback(() => {
    axios({
      method: "post",
      url: "/post/update",
      params: {
        id: post.id,
        title: title.trimRight(),
        content: content.trimRight(),
        now: moment(now()).format("YYYYMMDDhmmss"),
      },
      withCredentials: true,
    })
      .then((res) => {
        fileList.forEach((file) => {
          formData.append("file", file.originFileObj);
        });
        console.log("fileList", fileList);
        axios({
          method: "post",
          url: "/post/uploadPostImage",
          data: formData,
          params: {
            postId: res.data.id,
            //update 값 이용해 기존의 이미지와 교체 여부 확인
            update: true,
            formData,
          },
          withCredentials: true,
        })
          .then((images) => {
            console.log("upload", images, res);
            if (res.status === 200) {
              message.success("Upload post success with image!. 🐳");
            } else {
              message.success("Upload post success!. 🐳");
            }
            dispatch({
              type: UPDATE_POST_ACTION,
              payload: {
                post: {
                  ...res.data,
                  images: images.data instanceof Array ? images.data : [],
                  comments: [],
                },
              },
            });
          })
          .then(() => {
            // inputTitle.current.state.value = null;
            // inputContent.current.state.value = null;
            setTitle("");
            setContent("");
            setFileList([]);
          })
          .catch((error) => {
            console.error("😡 ", error);
          });
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  }, [content, dispatch, fileList, formData, post, title]);

  const onSubmit = useCallback(async () => {
    if (!(userInfo && userInfo.username)) {
      return message.warning("Login Please! 😱");
    }
    if (title.trim() === "") {
      return message.warning("Please include the titles.! 😱");
    }
    if (post && post.id !== undefined) {
      console.log("title trim", title);
      return updatePost();
    }

    axios({
      method: "post",
      url: "/post/publish",
      params: {
        title: title.trimRight(),
        content: content.trimRight(),
        now: moment(now()).format("YYYYMMDDhmmss"),
      },
      withCredentials: true,
    })
      .then((res) => {
        fileList.forEach((file) => {
          formData.append("file", file.originFileObj);
        });
        console.log("res", fileList[0], res);
        axios({
          method: "post",
          url: "/post/uploadPostImage",
          data: formData,
          params: { postId: res.data.id },
          withCredentials: true,
        })
          .then((images) => {
            console.log("upload", images, res);
            if (res.status === 200) {
              message.success("Upload post success with image!. 🐳");
            } else {
              message.success("Upload post success!. 🐳");
            }
            dispatch({
              type: PUBLISH_POST_ACTION,
              payload: {
                post: {
                  ...res.data,
                  images: images.data instanceof Array ? images.data : [],
                  comments: [],
                },
              },
            });
          })
          .catch((error) => {
            message.warning("Upload failed");
            console.error("😡 ", error);
          });
      })
      .then(() => {
        // inputTitle.current.state.value = null;
        // inputContent.current.state.value = null;
        setTitle("");
        setContent("");
        setFileList([]);
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  }, [
    content,
    dispatch,
    fileList,
    formData,
    post,
    title,
    updatePost,
    userInfo,
  ]);

  return (
    <>
      {!postingState && !post.id && (
        <Button
          type="primary"
          ghost
          block
          style={{
            display: "block",
            margin: "0.5rem auto 0",
            width: 400,
          }}
          onClick={() => {
            setPostingState(postingState ? false : true);
          }}
        >
          Posting
        </Button>
      )}
      {(postingState || post.id) && (
        <Form
          style={{
            margin: "0 auto",
            padding: "1rem 0 0 0",
            width: 400,
          }}
        >
          <Input
            placeholder="title"
            ref={inputTitle}
            allowClear
            defaultValue={post && post.title}
            onChange={onChangeContent}
          />
          <br />
          <br />
          <TextArea
            placeholder="content"
            ref={inputContent}
            allowClear
            defaultValue={post && post.content}
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
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={handleCancel}
            >
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </div>
          <Button
            type="default"
            value="large"
            htmlType="submit"
            onClick={onSubmit}
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              width: 400,
            }}
          >
            publish
          </Button>
        </Form>
      )}
    </>
  );
};

PostForm.propTypes = {
  post: PropTypes.object,
};

export default PostForm;
