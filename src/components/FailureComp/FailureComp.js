import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFailure } from '../../reducers/failureReducer';
import { useHistory } from 'react-router-dom';
import "./failurecomp.css";

function FailureComp() {
    const failureState = useSelector(state => state.failure);
    const dispatch = useDispatch();
    const history = useHistory();

    if (failureState) {
        
        function handleRelClick() {
            if (typeof(failureState?.param) !== "object") {
                dispatch((failureState?.func)(failureState?.param));
            }
            else {
                dispatch((failureState?.func)(Object.values(failureState?.param)[0], Object.values(failureState?.param)[1]));
            }
            dispatch(setFailure("CLEAR", null));
        }

        function ReloadBtn({ onClick, children }) {

            if (children) return (
                <button className="frnd-btn" onClick={onClick}>
                    {
                        children
                    }
                </button>
            )

            return (
                <button className="frnd-btn" onClick={onClick}>
                    Retry
                </button>
            )
        };

        if (failureState.type === "CONTENT" || failureState.type === "NOTIF" || failureState.type === "MSGING") {
            return (
                <div className="fail-ctn">
                    <p>
                        Failed to load { 
                            failureState.type === "CONTENT" ? 
                                "content" 
                            :   failureState.type === "NOTIF" ?
                                        "notifications"
                                    :   "chat or messages"
                            }
                    </p>
                    <ReloadBtn onClick={ handleRelClick } />
                </div>
            )
        }
        else if (failureState.type === "USER_PROF") {
            return (
                <div className="fail-ctn">
                    <p>
                        Failed to find user or user doesn't exist
                    </p>
                    <ReloadBtn onClick={ handleRelClick } />
                </div>
            )
        }
        else if (failureState.type === "POST" || failureState.type === "ONLY_POST") {
            return (
                <div className="fail-ctn">
                    <img src="/error-404.svg" alt="404-icon" />
                    <p>
                        Failed to retrieve resource or it doesn't exist
                    </p>
                    <ReloadBtn 
                    onClick={ failureState.type === "POST" ? 
                                () => dispatch(setFailure("CLEAR", null)) 
                            :   () => history.push("/home") }>
                        {
                            failureState.type === "POST" ?
                                "Ok"
                            :   "Back to home"
                        }
                    </ReloadBtn>
                </div>
            )
        }
        else if (failureState.type === "NEW_CHAT") {

            return (
                <div className="fail-ctn">
                    <img className="fail-warning-img" src="/error-light.svg" alt="error" />
                    <p>
                        Failed to get contacts
                    </p>
                </div>
            )
        }
        // else if (failureState.type === "ONLY_POST") {
        //     return (
        //         <div className="fail-ctn">
        //             <img src="/error-404.svg" alt="404-icon" />

        //             <p>
        //                 Failed to retrieve resource or it doesn't exist
        //             </p>

        //             <ReloadBtn onClick={() => {history.push("/home")}}>
        //                 Back to home
        //             </ReloadBtn>
        //         </div>
        //     )
        // }
        // else if (failureState.type === "NOTIF") {
        //     return (
        //         <div className="fail-ctn">
        //             <p>
        //                 Failed to load notifications
        //             </p>
        //             <ReloadBtn onClick={ handleRelClick } />
        //         </div>
        //     )
        // }
    };
};

export default FailureComp