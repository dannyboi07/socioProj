import { registerUser } from "../services/registerService";
import { loginUser } from "../services/loginService";
import { setStatusNotif } from "./statusNotifReducer";
import changeroute from "../utils/customEvents";

const userDetails = JSON.parse(window.localStorage.getItem("socioUser"));
let initialState = null;

if (userDetails) {
  initialState = {
    name: userDetails.name,
    username: userDetails.username,
    profImgSrc: userDetails.profImgSrc,
    token: userDetails.token,
    uId: userDetails.uId
  };
}

export default function userReducer(state = initialState, action) {
  // console.log(action);
  switch(action.type) {
    case "LOGIN":

      const { token, name, username, profImgSrc, uId } = action.data;

      return state = { name, username, token, profImgSrc, uId };

    case "SET_USER": 

      return state = { name: action.data.name, username: action.data.username, uId: action.data.uId, token: action.data.token, profImgSrc: action.data.profImgSrc };
    
    case "LOG_OUT":

      return state = action.data;

    default:
      return state;
  };
};

function initializeUser(userDetails) {
  return {
    type: "SET_USER",
    data: userDetails
  };
};

function dispatchRegister(userDetails) {
  return async dispatch => {
    let resRegUserDetails;
    let resUserDetails
    try {
      resRegUserDetails = await registerUser(userDetails);
      resUserDetails = await loginUser({ 
        username: userDetails.get("username"), 
        password: userDetails.get("password") 
      });
    } catch (err) {
      console.error(err);
      if (err.response.data.type === "register") {
        dispatch(setStatusNotif("SET_ERR_NOTIF", err.response.data.error, 3));
      }
      else if (err.response.data.type === "login") {
        dispatch(setStatusNotif("SET_ERR_NOTIF", err.response.data.error, 3));
        window.dispatchEvent(changeroute);
      }
      return;
    }
    dispatch({
      type: "LOGIN",
      data: resUserDetails
    });
    dispatch(setStatusNotif("SET_NEU_NOTIF", "Registered and logged in", 3));
  };
};

function dispatchLogin(userDetails) {
  return async dispatch => {

    let loginRes;

    try {
      
      loginRes = await loginUser(userDetails);

      const { token, name, username, profImgSrc, uId } = loginRes;
      window.localStorage.setItem("socioUser", JSON.stringify({
        name, username, profImgSrc, token, uId
      }));
      // window.localStorage.setItem("socioTheme", JSON.stringify({
      //   theme
      // }));
    } catch (err) {
      console.error(err);
      dispatch(setStatusNotif("SET_ERR_NOTIF", err.response.data.error, 3));
      return;
    }

    dispatch({
      type: "LOGIN",
      data: loginRes
    });
    dispatch(setStatusNotif("SET_NEU_NOTIF", "Logged in", 3));
  };
};

function dispatchLogOut() {
  return dispatch => {
    window.localStorage.removeItem("socioUser");
    dispatch({
      type: "LOG_OUT",
      data: null
    });
    dispatch(setStatusNotif("SET_NEU_NOTIF", "Logged out", 2));
  };
};

export { initializeUser, dispatchRegister, dispatchLogin ,dispatchLogOut };