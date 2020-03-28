import { SIGN_UP_ACTION, LOG_IN_ACTION } from "./actions";

const initialState = {
  userInfo: { username: undefined, password: undefined }
};

const tempUser = {
  id: "asdf",
  password: "asdf"
};

const reducer = (state = initialState, action) => {
  console.log("action", action);
  switch (action.type) {
    case SIGN_UP_ACTION: {
      return {
        ...state,
        userInfo: action.payload
      };
    }
    // case LOG_IN_ACTION: {
    //   return {
    //     ...state,
    //     userInfo: action.payload
    //   };
    // }
    default: {
      return {
        ...state
      };
    }
  }
};

export default reducer;
