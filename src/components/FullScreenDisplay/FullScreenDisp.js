import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { setFSData, removeFSData } from '../../reducers/fullScreenReducer';
import { getPost } from '../../services/contentService';
import { setStatusNotif } from '../../reducers/statusNotifReducer';
import "./fullscrndisp.css";
import { setFailure } from '../../reducers/failureReducer';

function FullScreenDisp({ children, displayPost, goback }) {
    const storeHasAllFsData = useSelector(state => state.fullscreenData ? true : false);
    const ifDisplayingFail = useSelector(state => state.failure?.type === "NEW_CHAT");
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const location = useLocation();

    function handleCloseFullscreen() {
        if (displayPost || goback) history.goBack();
        if (ifDisplayingFail) dispatch(setFailure("CLEAR"));
        dispatch(removeFSData());
    };

    function onEscPress(e) {
        if (e.key === "Escape") {
            handleCloseFullscreen();
        };
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onEscPress);

        if (!storeHasAllFsData && displayPost) {
            console.log("fsd post");
            // history.goBack();
            getPost(params.postId)
            .then(resPost => dispatch(setFSData(resPost)))
            .catch(err => {
                console.error(err);
                const newPath = location.pathname.split("/");
                dispatch(setStatusNotif("SET_ERR_NOTIF", "Failed to retrieve post or resource doesn't exist", 3));
                history.replace(`/${newPath[1]}/${newPath[2]}`, null);
            });
        }

        return () => {
            document.body.style = undefined;
            document.removeEventListener("keydown", onEscPress);
        }
    }, []);

    return (
        <div className="pos-abs-wrapper">
            <div className="flscrn-post-ctn-bg">
                {
                    children
                }

                <img className="close-post-flscrn" src="/close-icon.svg" alt="Close" onClick={ handleCloseFullscreen } />

            </div>
        </div>
    )
}

export default FullScreenDisp;