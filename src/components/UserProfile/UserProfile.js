import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { followUser, unFollowUser } from '../../services/userService';
import "./userprofile.css";
import UserProfPosts from '../UserProfPosts/UserProfPosts';
import LoadingComp from '../LoadingComp/LoadingComp';
import FailureComp from '../FailureComp/FailureComp';
import { getUserThunk } from '../../reducers/usersReducer';
import { setStatusNotif } from "../../reducers/statusNotifReducer"

function UserProfile() {
    const params = useParams();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const failureState = useSelector(state => state.failure?.type === "USER_PROF");
    const userProf = useSelector(state => state.users);

    const [follows, setFollows] = useState(userProf?.friends);
    const [curView, setCurView] = useState({ posts: true, blogs: false });

    useEffect(() => {
        if (user) {
            dispatch(getUserThunk(params.username, user.token)); 
        }
        else {
            dispatch(getUserThunk(params.username));
        };
    }, []);

    useEffect(() => {
        setFollows(userProf?.friends);
    }, [userProf]);

    if (failureState) {
        return (
            <div className="user-prof-ctn--loading">
                <FailureComp />
            </div>
        )
    }

    if (!userProf) {
    return (
        <div className="user-prof-ctn--loading">
            <LoadingComp />
        </div>
    )};

    async function handleFollowBtnClick() {
        if (follows) {
            try {
                await unFollowUser(userProf.u_id, user.token);
                setFollows(!follows);
                dispatch(setStatusNotif("SET_NEU_NOTIF", `You have unfriended ${userProf.name}`));
            } catch(err) {
                console.error(err);
                dispatch(setStatusNotif("SET_ERR_NOTIF", `Failed to send request to ${userProf.name}`, 2));
            };
        } else {
            try {
                await followUser(userProf.u_id, user.token);
                setFollows(!follows);
                dispatch(setStatusNotif("SET_NEU_NOTIF", `You are now friends with ${userProf.name}!`));
            } catch(err) {
                console.error(err);
                dispatch(setStatusNotif("SET_ERR_NOTIF", `Failed to send request to ${userProf.name}`, 2));
            };
        };
    };

    function handlePostsClick() {
        setCurView({ posts: true, blogs: false });
    };

    function handleBlogsClick() {
        setCurView({ posts: false, blogs: true });
    };

    return (
        <div className="user-prof-ctn">
            <div className="user-prof-details-ctn">

                <div className="user-prof-img-ctn">
                    <img className="user-prof-img" src={ userProf.imgloc } alt="Profile picture" />
                </div>            
                    <div className="user-prof-right-ctn">
                        <p>
                            { userProf.name }
                        </p>
                        <p>
                            { userProf.username }
                        </p>
                        <p>
                            { userProf.email }
                        </p>

                        {  

                            user && user.uId !== userProf.u_id 
                            ? <button id="user-flw-btn" className={`${follows ? "unfrnd-btn" : "frnd-btn"}`} onClick={ handleFollowBtnClick }>
                                { follows ? "Unfriend" : "Add Friend" }
                            </button>
                            : <button>
                                Edit Profile
                            </button>
                        }
                    </div>
                </div>
            <hr className="user-cntnt-hr-top"/>
            <div className="user-cntnt-switch">
                {
                    userProf.posts && <button onClick={ handlePostsClick }>
                        Posts
                    </button>
                }
                {
                    true && <>
                        <hr />
                        <button onClick={ handleBlogsClick }>
                            Blogs
                        </button>
                    </> 
                }
            </div>
            <hr className="user-cntnt-hr-btm" />
            {
                userProf && userProf.posts && curView.posts && <UserProfPosts name={ userProf.name } imgloc={userProf.imgloc} username={userProf.username} posts={ userProf.posts }/>
            }
        </div>
    )
}

export default UserProfile;