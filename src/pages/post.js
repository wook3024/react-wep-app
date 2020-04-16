import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import axios from "axios";

import { GET_POST_DATA } from "../reducers/actions";
import Postcard from "../components/postcard";
import PostForm from "../components/postForm";
import "./App.css";

const Div = styled.div``;

const Profile = () => {
  const { post, userInfo } = useSelector((state) => state);
  const dispatch = useDispatch();

  console.log("Post.js", post);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/post",
    })
      .then((postData) => {
        dispatch({
          type: GET_POST_DATA,
          payload: postData.data,
        });
      })
      .catch((error) => {
        console.error("😡 ", error);
      });
  }, [dispatch, post.length]);

  return (
    <Div>
      <link
        rel="stylesheet"
        type="text/css"
        charset="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
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
    </Div>
  );
};

export default Profile;
