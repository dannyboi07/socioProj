import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from './components/Navbar/Navbar';
import "./App.css";
import Home from "./components/Home/Home";
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import { Switch, Route, Redirect, useLocation, useParams } from "react-router-dom";
import CreatePost from "./components/CreatePost/CreatePost";
import UserProfile from "./components/UserProfile/UserProfile";
import PostFullscreen from "./components/PostFullscreen/PostFullscreen";
import FullScreenDisp from "./components/FullScreenDisplay/FullScreenDisp";
import StatusNotif from './components/StatusNotif/StatusNotif';
import { addNotif, getAllNotifs } from "./reducers/notificationReducer";
import Messaging from "./components/Messaging/Messaging";
import { addMsg } from "./reducers/messagingReducer";
import NewChat from "./components/NewChat/NewChat";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const user = useSelector(state => state.user);
  // const userS = useSelector(state => state.user);
  // console.log(userS);

  useEffect(() => {
    // const userDetails = JSON.parse(window.localStorage.getItem("socialMediaAppUser"));
    if (user) {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener("message", e => {
          if (e.data.reqtype === "GET_TOKEN") {
            navigator.serviceWorker.controller.postMessage({ token: user.token, primaryKey: e.data.primaryKey });
          }
          if (e.data.notifType === "message" && location.pathname.includes("/messages") && location.pathname.includes(e.data.title.replace(/ /g, '').toLowerCase())) {

            // Sending object to redux in an array to use ...rest operator over just action.data since 
            // the action handler requires the data passed to be iterable and we can reuse the same action handler
            dispatch(addMsg([{
              msg_id: e.data.msg_id,
              u_id_from: e.data.u_id_from,
              u_id_to: e.data.u_id_to,
              msg_text: e.data.body,
              date: e.data.date,
              time: e.data.time
            }]));

            navigator.serviceWorker.controller.postMessage({ token: user.token, primaryKey: e.data.primaryKey })
          }
          else {
            console.log("else adding notif");
            dispatch(addNotif( [{
              primaryKey: e.data.primaryKey,
              title: e.data.title,
              body: e.data.body,
              icon: e.data.icon,
              url: e.data.url
            }] ))
          };
          //console.log(`The service worker sent the client a message of ${Object.values(e.data)}`, e);
        });
      };
    };

    // if (userDetails) {
    //   // dispatch(initializeUser(userDetails));
    //   // dispatch(getAll(userDetails.token));
    //   if (userDetails && navigator.serviceWorker) {
    //     navigator.serviceWorker.addEventListener("message", e => {
    //       console.log(`The service worker sent the client a message of ${Object.values(e.data)}`, e);
    //     })
    //   }
    // }
    // else dispatch(getAll());
  }, [dispatch, user]);

  const fullscreenData = useSelector(state => state.fullscreenData);

  return (
    <div>
      <Navbar/>
      <StatusNotif />
      {
        fullscreenData?.creation 
        && 
        user &&
        <FullScreenDisp displayPost={false}>
          <CreatePost />
        </FullScreenDisp>
      }
      <Switch>

        <Route exact path="/users/:username/post/:postId">
          <UserProfile />
          <FullScreenDisp displayPost={ true }>
            {
              
                <PostFullscreen post={ fullscreenData?.postData }/>
            }
           </FullScreenDisp>
        </Route>

        <Route exact path="/home/post/:postId">
          <Home />
          <FullScreenDisp displayPost={ true }>
            {
              fullscreenData?.post 
              && 
                <PostFullscreen post={ fullscreenData.postData }/>
            }
           </FullScreenDisp>
        </Route>

        <Route path={["/messages/new/:username", "/messages/new", "/messages/:username", "/messages"]}>
          { 
            user ? 
              location.pathname === "/messages/new" ?
                <>
                  <Messaging />
                  <FullScreenDisp goback={ true }>
                    <NewChat />
                  </FullScreenDisp>
                </>
              : <Messaging /> 
            : <Redirect to="/login" /> 
          }
        </Route>

        <Route exact path="/users/:username">
          <UserProfile/>
        </Route>

        <Route exact path="/post/:postId">
          <PostFullscreen onlyPost={true} />
        </Route>

        <Route path="/register">
          { user ? <Redirect to="/home" /> : <Register />}
        </Route>
        <Route path="/login">
          { user ? <Redirect to="/home"/> : <Login />}
        </Route>

        <Route exact path="/home">
          <Home />
        </Route>

        {/* <Route exact path="/">
          <div></div>
        </Route> */}

        <Route path="/*">
          <p>Not found</p>
        </Route>
      </Switch>
    </div>
  );
}

export default App;