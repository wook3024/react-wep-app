import {
  LOG_IN_ACTION,
  LOG_OUT_ACTION,
  USER_INFO_REFRESH_ACTION,
  GET_POST_DATA_ACTION,
  GET_MORE_POST_ACTION,
  REMOVE_POST_ACTION,
  UPDATE_POST_ACTION,
  ADD_COMMENT_ACTION,
  COMMENT_REMOVE_ACTION,
  COMMENT_UPDATE_ACTION,
  GET_COMMENT_ACTION,
  PUBLISH_POST_ACTION,
  GET_HASHTAG_POST_ACTION,
  POST_LIST_REMOVE_ACTION,
  SET_HASHTAG_ACTION,
  SET_SEARCHTAG_ACTION,
  GET_FOLLOWING_DATA_ACTION,
  GET_SCRAP_DATA_ACTION,
  UNFOLLOWING_ACTION,
  UNSCRAP_ACTION,
  GET_NOTIFICATION_DATA_ACTION,
  REMOVE_NOTIFICATION_DATA_ACTION,
  SET_LIKE_STATE_ACTION,
} from "./actions";
import moment from "moment";

const initialState = {
  userInfo: {},
  post: [],
  hashtag: undefined,
  searchtag: undefined,
  following: [],
  scrap: [],
  notification: [],
  likeState: undefined,
  disLikeState: undefined,
  signupCheck: false,
  loginCheck: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_ACTION: {
      return {
        ...state,
        userInfo: {
          ...action.payload,
          created_at: moment(action.payload.created_at).format("LL"),
        },
      };
    }
    case LOG_OUT_ACTION: {
      return {
        ...state,
        userInfo: {},
      };
    }
    case USER_INFO_REFRESH_ACTION: {
      return {
        ...state,
        userInfo: {
          ...action.payload,
          created_at:
            action.payload.created_at === null
              ? moment(action.payload.created_at).format("LL")
              : null,
        },
      };
    }
    case GET_POST_DATA_ACTION: {
      console.log("get post data", state.post, action.payload.post);
      if (!state.post[0] || state.post[0] !== action.payload.post[0]) {
        console.log(
          "get post data aicton check",
          state.post,
          action.payload.post
        );
        state.post = action.payload.post;
      }
      return {
        ...state,
      };
    }
    case GET_MORE_POST_ACTION: {
      console.log("get post data", state.post, action.payload.post);
      state.post = [...state.post, ...action.payload.post];
      return {
        ...state,
      };
    }
    case SET_HASHTAG_ACTION: {
      console.log("get hashtag data", action.payload.post);
      if (state.hashtag === action.payload.hashtag) {
        state.post.hashtag = action.payload.hashtag;
      } else {
        state.post.hashtag = null;
      }
      return {
        ...state,
        hashtag: action.payload.hashtag,
      };
    }
    case SET_SEARCHTAG_ACTION: {
      console.log("get searchtag data", action.payload.post);
      //같은 페이지 내에서 이동하는지 체크하기위함
      if (state.searchtag === action.payload.searchtag) {
        state.post.searchtag = action.payload.searchtag;
      } else {
        state.post.searchtag = null;
      }
      return {
        ...state,
        searchtag: action.payload.searchtag,
      };
    }
    case GET_HASHTAG_POST_ACTION: {
      state.post = [];
      console.log("get hashtag post data", state.post, action.payload.hashtag);
      action.payload.hashtag.forEach((hashtag) => {
        state.post.push(hashtag.post);
        console.log("hashtag.post check", hashtag.post);
      });
      console.log("check hashtag post", state.post);
      return {
        ...state,
      };
    }
    case POST_LIST_REMOVE_ACTION: {
      return {
        ...state,
        post: [],
      };
    }
    case REMOVE_POST_ACTION: {
      // console.log("post id, info id", action.payload.id);
      return {
        ...state,
        post: state.post.filter((post) => post.id !== action.payload.id),
      };
    }
    case UPDATE_POST_ACTION: {
      const postIndex = state.post.findIndex((post) => {
        return post.id === action.payload.post.id;
      });
      console.log("UPDATE POST ACTION", action.payload, postIndex);
      state.post[postIndex] = action.payload.post;
      return {
        ...state,
      };
    }
    case PUBLISH_POST_ACTION: {
      // console.log("post id, info id", action.payload.id);
      return {
        ...state,
        post: [action.payload.post, ...state.post],
      };
    }
    case ADD_COMMENT_ACTION: {
      const data = action.payload;
      console.log("ADD_COMMENT CHECK", data);
      const postIndex = state.post.findIndex((post) => post.id === data.postId);
      let tempPostComments = state.post[postIndex].comments.filter(
        (comment) => {
          return comment.group !== data.comments[0].group;
        }
      );
      const newPostComment = [];
      tempPostComments.forEach((comment) => {
        console.log(
          "forEach check",
          data,
          comment.group,
          data.comments[0].group,
          data.flag
        );
        if (comment.group > data.comments[0].group && data.flag === undefined) {
          newPostComment.push(...data.comments);
          data.flag = true;
        }
        newPostComment.push(comment);
      });
      if (data.flag === undefined) {
        newPostComment.push(...data.comments);
      }
      state.post[postIndex].comments = newPostComment;
      console.log("ADD_COMMENT CHECK", state.post[postIndex].comments);
      return {
        ...state,
      };
    }
    case COMMENT_REMOVE_ACTION: {
      let postIndex = state.post.findIndex(
        (post) => post.id === action.payload.postId
      );
      state.post[postIndex].comments = state.post[postIndex].comments.filter(
        (comment) => {
          return comment.id !== action.payload.commentId;
        }
      );
      return {
        ...state,
      };
    }
    case COMMENT_UPDATE_ACTION: {
      let postIndex = state.post.findIndex(
        (post) => post.id === action.payload.postId
      );
      state.post[postIndex].comments = state.post[postIndex].comments.map(
        (comment) => {
          if (comment.id === action.payload.commentId) {
            comment.comment = action.payload.comment;
          }
          return comment;
        }
      );
      return {
        ...state,
      };
    }
    case GET_COMMENT_ACTION: {
      const postIndex = state.post.findIndex(
        (post) => post.id === action.payload.postId
      );
      state.post[postIndex].comments = action.payload.comments;
      console.log(
        "get comment actopn",
        action.payload.comments,
        state.post[postIndex].comments
      );
      return {
        ...state,
      };
    }
    case GET_FOLLOWING_DATA_ACTION: {
      console.log("get following action", action.payload);
      return {
        ...state,
        following: action.payload.following,
      };
    }
    case GET_SCRAP_DATA_ACTION: {
      console.log("get scrap action", action.payload);
      return {
        ...state,
        scrap: action.payload.scrap,
      };
    }
    case GET_NOTIFICATION_DATA_ACTION: {
      console.log("get notification action", action.payload);
      return {
        ...state,
        notification: action.payload.notification,
      };
    }
    case REMOVE_NOTIFICATION_DATA_ACTION: {
      console.log(
        "remove notification action",
        action.payload,
        state.notification.data
      );
      state.notification = state.notification.data.filter((data) => {
        return data.id !== action.payload.id;
      });
      console.log("notification action result", state.notification);
      return {
        ...state,
      };
    }
    case UNFOLLOWING_ACTION: {
      console.log("get scrap action", action.payload);
      state.following = state.following.filter((data) => {
        return data.key !== action.payload.key;
      });
      return {
        ...state,
      };
    }
    case UNSCRAP_ACTION: {
      console.log("get scrap action", action.payload);
      state.scrap = state.scrap.filter((data) => {
        console.log("unscrap action check", data.key, action.payload.key);
        return data.key !== action.payload.key;
      });
      return {
        ...state,
      };
    }
    case SET_LIKE_STATE_ACTION: {
      if (action.payload.type === "dislike") {
        state.disLikeState = action.payload.state;
      } else {
        state.likeState = action.payload.state;
      }
      return {
        ...state,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
};

export default reducer;
