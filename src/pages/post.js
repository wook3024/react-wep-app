import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import {
  GET_POST_DATA_ACTION,
  GET_MORE_POST_ACTION,
} from "../reducers/actions";
import Postcard from "../components/postcard";
import PostForm from "../components/postForm";
import "./App.css";

let getDataCheck = false;
let getPost = [];
let firstPostId = undefined;

const Profile = () => {
  const { post, userInfo } = useSelector((state) => state);
  const dispatch = useDispatch();

  console.log("Post.js", post);

  const onScroll = () => {
    //getDataCheck조건은 처리 중인 작업이 끝날 때까지 때까지 기다린 후
    //다음 작업을 시작하기 위해 사용한다.
    //getPost[0] && getPost.map을 사용하는 건 마지막에 나오는 포스트
    if (
      window.scrollY >
        document.documentElement.scrollHeight -
          document.documentElement.clientHeight -
          500 &&
      !getDataCheck &&
      getPost[0] &&
      getPost.map((post) => {
        return post.id === firstPostId;
      })
    ) {
      getDataCheck = true;
      console.log(
        "getNewpost",
        getPost,
        getPost.length - 1,
        getPost[getPost.length - 1]
      );
      axios({
        method: "get",
        url: "/post",
        params: { id: getPost[0] ? getPost[getPost.length - 1].id : undefined },
      })
        .then((res) => {
          firstPostId = firstPostId === undefined ? getPost[0].id : firstPostId;
          dispatch({
            type: GET_MORE_POST_ACTION,
            payload: { post: (getPost = res.data) },
          });
        })
        .then(() => {
          getDataCheck = false;
        })
        .catch((error) => {
          console.error("😡 ", error);
        });
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
    axios({
      method: "get",
      url: "/post",
      params: { id: getPost[0] ? getPost[getPost.length - 1].id : undefined },
    })
      .then((postData) => {
        dispatch({
          type: GET_POST_DATA_ACTION,
          payload: { post: (getPost = postData.data) },
        });
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {userInfo && userInfo.username && <PostForm />}
      {post.map((data) => {
        //postCard 컴포넌트 내에서 Comment컴포넌트를 출력할 때
        //모든 값을 출력하기 위해 마지막에 하나의 더미테이터가 필요
        //하지만 현재 페이지에서 리렌더링이 두번 되는 문제 발생
        //왜 그런지 모르겠는데 데이터 추가된 상태가 유지되서
        //이중으로 더미데이터가 삽입되는 현상을 보임
        //따라서 if문으로 더미 데이터가 1개만 넣어지도록 제한
        // const post = data;
        // if (
        //   (post.comments[1] &&
        //     post.comments[data.comments.length - 1].id !==
        //       post.comments[data.comments.length - 2].id) ||
        //   post.comments.length === 1
        // ) {
        //   post.comments = [
        //     ...data.comments,
        //     { ...data.comments[data.comments.length - 1], group: null },
        //   ];
        // }
        // console.log("data", post.comments);
        return <Postcard key={data.created_at} post={{ data }} />;
      })}
    </div>
  );
};

export default Profile;
