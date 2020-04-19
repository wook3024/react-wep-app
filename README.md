#social_network_service based web_app


#Technologies
사용: React-Hooks, Redux, NodeJS, Postgresql, Sequelize
예정: Redux-Saga, AWS, React-Native 
관심: Typescript, GraphQL, Apollo, Prisma, JWT


#issue
1.이미지 불러올 때 reload 되는 문제 => require 사용이 어울리지 않는 건진 public 폴더에 최적화 된 건지 확인 필요
2.sequelize 모델간의 관계성 불안정
3.보안 관련 문제점 - 1)패스워드 확인할 때 암호화 되지 않음
                  2)http통신시 지켜져야할 사용자 정보까지 보냄
4.검색엔진 최적화 관련 문제점 - 1)서버 사이드 렌더링 문제로 크롤러(bot)가 데이터를 긁어가지 못함(서버 사이드 렌더링 + 서버 스플리팅)
5.post를 불러올 때 여러번 리렌더링되는 현상이 발생
6.sequelize에서 comment를 같은 그룹으로 묶기 위해 시간값을 이용하려 했지만 알 수 없는 에러 발생 => 값을 넘겨줌으로써 해결
7.대댓글 부분 코드 정리 필요                  
8.프로필 이미지 업데이트시 reload되는 문제 발생                          
9.postman이용 시 create-react-app의 proxy설정에 유의!
10.이미지 크기가 커지면 포스트 게시 할 때 reload 일어난다. => 웹팩 설정 추가함으로써 해결(개발 모드에서만 발생하는 문제인 거 같다)devServer: {
    watchOptions: {
      ignored: [path.resolve(__dirname, "path/to/images")],
    },
  }, 
11.이미지를 올릴 때 reload가 일어나지 않으면 multer에 저장된 이전 데이터가 초기화되지 않아 현재 추가한 이미지와 이전에 추가한 이미지가 같이 업로드되는 현상이 발생 => formdata 변수를 전역으로 선언해서 발생한 문제...
12.image 업데이트를 진행하면서 기존의 이미지를 삭제하려 했으나 "fs in not a function"에러가 발생. => server에서 삭제를 진행하니 정상적으로 동작. 하지만 절대경로를 이용해야 가능.
=> path.join(__dirname, path) 이용해서 해결
13.html태크에서 크기를 넘어가도 줄바꿈되지 않는 현상 => wordBreak: "break-all" 추가함으로서 해결
14.dispatch안하고 re-rendering 어떻게 할까. hashtag page에서 필요. useState 이용해서 가능할거라 생각했는데 안되네...




import React, { useEffect } from "react";
import { useSelector, useDispatch, useState } from "react-redux";

import Postcard from "../components/postcard";
import PostForm from "../components/postForm";
import "./App.css";
import { USER_INFO_REFRESH_ACTION } from "../reducers/actions";

let getDataCheck = false;

let posts = [];

const Hashtag = () => {
  const [renderingCheck, setRenderingCheck] = useState(false);
  const { post, userInfo } = useSelector((state) => state);

  const dispatch = useDispatch();

  console.log("get Hashtah Post", post);
  if (!posts[0] && posts.length <= 3) {
    let i = -1;
    while (++i <= 3) {
      posts.push(post[i]);
    }
    console.log("posts check", posts, posts.length);
  }

  const onScroll = () => {
    if (
      window.scrollY >
        document.documentElement.scrollHeight -
          document.documentElement.clientHeight -
          500 &&
      !getDataCheck &&
      posts.length - 1 < post.length
    ) {
      getDataCheck = true;
      console.log("getNewpost");
      const postIndex = post.findIndex((post) => {
        return posts[posts.length - 1].id === post.id;
      });
      let i = 0;
      while (++i <= 3) {
        posts.push(post[postIndex + i]);
      }
      console.log("scroll push", posts);
      //   setRenderingCheck(renderingCheck ? false : true);
      //   dispatch({
      //     type: USER_INFO_REFRESH_ACTION,
      //     payload: userInfo,
      //   });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!posts[0] && posts.length <= 3) {
      let i = -1;
      while (++i <= 3) {
        posts.push(post[i]);
      }
      //   setRenderingCheck(renderingCheck ? false : true);
      console.log("posts check", posts, posts.length);
      //   dispatch({
      //     type: USER_INFO_REFRESH_ACTION,
      //     payload: userInfo,
      //   });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts.length]);

  return (
    <div>
      {userInfo && userInfo.username && <PostForm />}
      {posts.map((data) => {
        return <Postcard key={data.created_at} post={{ data }} />;
      })}
    </div>
  );
};

export default Hashtag;






// "dev": "BROWSER='google-chrome-stable' nodemon --experimental-modules",
    // "start": "BROWSER='google-chrome-stable' react-scripts start",
    // "build": "react-scripts build",


router.post("/uploadPostImage", (req, res, next) => {
  console.log("uploda image data 😱😱😱\n", req);
  try {
    if (req.isAuthenticated()) {
      try {
        upload(req, res, (err) => {
          // console.log("user check", req);
          if (err instanceof multer.MulterError) {
            return next(err);
          } else if (err) {
            return next(err);
          }

          const data = req.query;
          // console.log("uploadPostImage data", data);
          return db.Image.destroy({
            where: { postId: data.postId },
          }).then(async (destroyResult) => {
            // console.log(
            //   "Image destroy state",
            //   destroyResult,
            //   data.postId,
            //   (await req).files
            // );
            if (!(await req).files[0]) {
              return res.send("Upload Complete! 🐳");
            }
            (await req).files.forEach((file) => {
              console.log("file info", file.filename);
              // console.log("file.path", file);
              db.Image.create({
                postId: data.postId ? data.postId : null,
                filename: file.filename,
                userId: data.userId ? data.userId : null,
              });
            });
            return res.json((await req).files);
          });
        });
      } catch (error) {
        console.error("😡 ", error);
        next(error);
      }
    } else {
      res.send("Login Please! 😱");
    }
  } catch (error) {
    console.error("😡 ", error);
    next(error);
  }
});

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, Form, message, Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

import { PUBLISH_POST_ACTION, UPDATE_POST_ACTION } from "../reducers/actions";

const moment = require("moment");
const { now } = moment;

const FormData = require("form-data");
const { TextArea } = Input;

const formData = new FormData();

const PostForm = ({ post }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const { userInfo } = useSelector((state) => state);

  const inputTitle = useRef(null);
  const inputContent = useRef(null);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (post && post.id) {
  //     toDataURL("./logo192.png", function (dataUrl) {
  //       // console.log("RESULT:", dataUrl);
  //       var file = dataURLtoFile(
  //         dataUrl,
  //         moment(now()).format("YYYYMMDDhmmss") + post.images[0].filename
  //       );
  //       console.log(file);
  //       setFileList([
  //         {
  //           uid: "-1",
  //           name:
  //             moment(now()).format("YYYYMMDDhmmss") + post.images[0].filename,
  //           status: "done",
  //           originFileObj: file,
  //           url: "./logo192.png",
  //         },
  //       ]);
  //     });
  //   }
  // }, [post]);

  function toDataURL(url, callback) {
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
  }

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

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
        title,
        content,
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
                post: { ...res.data, images: images.data, comments: [] },
              },
            });
            inputTitle.current.state.value = null;
            inputContent.current.state.value = null;
          })
          .catch((error) => {
            console.error("😡 ", error);
          });
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  }, [content, dispatch, fileList, post, title]);

  const onSubmit = useCallback(async () => {
    if (!(userInfo && userInfo.username)) {
      message.warning("Login Please! 😱");
      return;
    }

    if (post && post.id !== undefined) {
      updatePost();
      return;
    }

    axios({
      method: "post",
      url: "/post/publish",
      params: {
        title,
        content,
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
                post: { ...res.data, images: images.data, comments: [] },
              },
            });
          })
          .catch((error) => {
            message.warning("Upload failed");
            console.error("😡 ", error);
          });
      })
      .then(() => {
        inputTitle.current.state.value = null;
        inputContent.current.state.value = null;
        setFileList([]);
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  }, [content, dispatch, fileList, post, title, updatePost, userInfo]);

  return (
    <Form
      style={{
        margin: " 0 auto",
        width: 350,
      }}
    >
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
          width: 350,
        }}
      >
        publish
      </Button>
    </Form>
  );
};

export default React.memo(PostForm);
