import {
  SIGN_UP_ACTION,
  LOG_IN_ACTION,
  SIGN_UP_CHECK,
  LOG_IN_CHECK
} from "./actions";
import axios from "axios";

const initialState = {
  userInfo: {},
  signupCheck: false,
  loginCheck: true
};

let info = {};

const callAxios = async (type, address, payload) => {
  const result = axios({
    method: type,
    url: `http://localhost:8080${address}`,
    params: {
      ...payload
    },
    credentials: "include",
    withCredentials: true
  });
  info = await result;
  console.log(info);
  return result;
};

const reducer = (state = initialState, action) => {
  // console.log("action", action);
  switch (action.type) {
    case SIGN_UP_ACTION: {
      callAxios("post", "/user/signup", action.payload);
      return {
        ...state
      };
    }
    case SIGN_UP_CHECK: {
      return {
        ...state,
        signupCheck: action.payload === undefined ? true : false,
        userInfo: action.payload
      };
    }
    case LOG_IN_ACTION: {
      // callAxios("post", "/user/signin", action.payload);
      return {
        ...state
      };
    }
    case LOG_IN_CHECK: {
      return {
        ...state
      };
    }
    default: {
      return {
        ...state
      };
    }
  }
};

export default reducer;
