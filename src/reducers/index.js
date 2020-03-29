import { SIGN_UP_ACTION, LOG_IN_ACTION, SIGN_UP_CHECK } from "./actions";
import axios from "axios";

const initialState = {
  userInfo: { username: undefined, password: undefined },
  loginCheck: false,
  signupCheck: false
};

const callAxios = async (type, address, payload) => {
  return await axios({
    method: type,
    url: `http://localhost:8080${address}`,
    params: {
      ...payload
    }
  });
};

const reducer = (state = initialState, action) => {
  console.log("action", action);
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
      return {
        ...state,
        loginCheck: action.payload === undefined ? false : true
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
