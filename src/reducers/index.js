import {
  LOG_IN_ACTION,
  LOG_OUT_ACTION,
  USER_INFO_REFRESH,
  GET_POST_DATA,
  REMOVE_POST_ACTION,
  UPDATE_POST_ACTION,
  ADD_COMMENT_ACTION,
} from "./actions";
import moment from "moment";

const initialState = {
  userInfo: {},
  post: [],
  signupCheck: false,
  loginCheck: true,
};

// const callAxios = async (type, address, payload) => {
//   const result = axios({
//     method: type,
//     url: `http://localhost:8080${address}`,
//     params: {
//       ...payload
//     },
//     credentials: "include",
//     withCredentials: true
//   });
//   info = await result;
//   console.log(info);
//   return result;
// };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_ACTION: {
      // callAxios("post", "/user/signin", action.payload);
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
    case USER_INFO_REFRESH: {
      return {
        ...state,
        userInfo: {
          ...action.payload,
          created_at: moment(action.payload.created_at).format("LL"),
        },
      };
    }
    case GET_POST_DATA: {
      return {
        ...state,
        post: action.payload,
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
      // console.log("post id, info id", action.payload.id);
      return {
        ...state,
        post: state.post.map((post) => {
          if (post.id === action.payload.id) {
            return (post = action.payload);
          }
          return post;
        }),
      };
    }
    case ADD_COMMENT_ACTION: {
      let postIndex = state.post.findIndex(
        (post) => post.id === action.payload.postId
      );
      // console.log("ADD_COMMENT CHECK", postIndex, action.payload);
      state.post[postIndex].comments.push(action.payload);
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
