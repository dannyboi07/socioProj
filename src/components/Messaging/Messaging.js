import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
// import { getContacted, getMsgs } from '../../services/messageService';
import { clrMsging, getContactedRdx, getMsgsRdx, postMsgRdx } from '../../reducers/messagingReducer';
// import FriendsCtn from '../FrndsCtn/FriendsCtn';
import Friend from '../Friend/Friend';
import Profile from '../Profile/Profile';
import Message from '../Message/Message';
import "./messaging.css";
import LoadingComp from "../LoadingComp/LoadingComp";
import FailureComp from '../FailureComp/FailureComp';
import { Link } from 'react-router-dom';
import { setNewChat } from '../../reducers/fullScreenReducer';
import { setStatusNotif } from '../../reducers/statusNotifReducer';

function Messaging() {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const location = useLocation();
    const user = useSelector(state => state.user);

    const messagingState = useSelector(state => state.messaging);
    const failureState = useSelector(state => state.failure?.type === "MSGING");
    const [active, setActive] = useState([]);
    const [curChat, setCurChat] = useState(null);
    const [msgInput, setMsgInput] = useState("");

    const [filter, setFilter] = useState("");

    const [mobileSwitch, setMobileSwitch] = useState([0, window.screen.width]);

    useEffect(() => {

        dispatch(getContactedRdx(user.token));

        if (location.pathname.includes("/new" || "new/")) {     //First option indicates that new chat menu was open when this component was mounting, 
            history.replace("/messages", [location.pathname]);  // second indicates that
        }
        return () => dispatch(clrMsging());
    }, []);

    useEffect(() => {

        if (messagingState?.contacted) {
            const temp = [];
            for (let i = 0; i < messagingState?.contacted.length; i++) {
                temp.push(false);
            }
            setActive([ ...temp ]);
        };
    }, [messagingState?.contacted]);

    useEffect(() => {

        if (params.username && curChat?.username !== params.username) {
            if (messagingState?.contacted) {

                let found = false;
                setActive(messagingState?.contacted.map((act, i) => {
                    if (!found && params.username === messagingState?.contacted[i].username) {

                        setCurChat(messagingState?.contacted[i]);
                        dispatch(getMsgsRdx(user.token, messagingState?.contacted[i].u_id));
                        found = true;
                        return true;
                    } else {

                        if (i === messagingState.contacted.length - 1 && !found) {    

                            dispatch(setStatusNotif("SET_ERR_NOTIF", "Couldn't find contact in your chat history or friends list", 3));
                            history.replace("/messages", null);
                        }
                        return false;
                    };
                }));
            };
        } 
        else if (!params.username) {
            setCurChat(null);
        };

    }, [params, messagingState?.contacted, curChat]);

    useEffect(() => {
        if (window.screen.width < 768) {
            if (params.username) {
                setMobileSwitch([ -1 * window.screen.width, 0 ]);
            } else setMobileSwitch([ 0, window.screen.width ]);
        };

    }, [params]);

    function handleMsgSubmit() {
        if (msgInput !== "") {
            dispatch(postMsgRdx(user.token, curChat.u_id, msgInput));
            setMsgInput("");
        };
    };

    if (failureState) {
        return (
            <div className="dming-ctn-wrapper">
                <div className="dming-ctn">
                    <FailureComp />
                </div>
            </div>
        );
    };

    if (!messagingState) {
        return (
            <div className="dming-ctn-wrapper">
                <div className="dming-ctn">
                    <LoadingComp />
                </div>
            </div>
        );
    }; 

    if (window.screen.width < 768) {
        return (
            <div className="dming-ctn-wrapper">

                <div className="dming-ctn">
                    
                    {/* <div className="dming-ctn__switcher">
                        <button 
                        className={`${params.username ? 
                                        "" 
                                        : "active-switcher-btn" }`}>
                            Friends
                        </button>

                        <button
                        className={`${params.username ? 
                                        "active-switcher-btn" 
                                        : ""}`}
                        disabled={ params.username ? false : true }>
                            Chat
                        </button>
                    </div> */}
                    <div
                    style={{ left: mobileSwitch[0] }}
                    className="frnds-ctn">

                        <div className="new-chat">
                            <Link 
                            to="/messages/new"
                            onClick={() => dispatch(setNewChat())}>
                                New Chat
                            </Link>
                        </div>

                        <input type="text" 
                        value={ filter }
                        onChange={ e => setFilter(e.target.value.toLowerCase())}
                        placeholder="Search..."
                        />
                        {   
                        filter !== "" ? 
                            messagingState?.contacted.map((friend, i) => {
                                if (friend.name.toLowerCase().includes(filter) || friend.username.toLowerCase().includes(filter)) {
                                    return (
                                        <Friend 
                                        key={ friend.u_id }
                                        active={ active[i] }
                                        onClick={ active[i] 
                                            ? null
                                            : () => history.push(`/messages/${friend.username}`)
                                        }
                                        username={ friend.username }
                                        name={ friend.name }
                                        imgloc={ friend.imgloc } />
                                    )
                                }
                            })

                        :   messagingState?.contacted.map((friend, i) => 
                            <Friend 
                            key={ friend.u_id }
                            active={ active[i] }
                            onClick={ active[i] 
                                ? null
                                : () => history.push(`/messages/${friend.username}`)
                            }
                            username={ friend.username }
                            name={ friend.name }
                            imgloc={ friend.imgloc } />
                        )
                        }
                    </div>
                    
                    <div
                    style={{ left: mobileSwitch[1] }}
                    className="dm-ctn">
                        {
                            curChat &&
                            <div className="dm-ctn__prof">
                                <img
                                src="/back-arrow.svg" 
                                alt="Back"
                                onClick={ () => history.replace("/messages", null) }
                                />

                                <Profile 
                                name={ curChat.name }
                                username={ curChat.username }
                                profImgSrc={ curChat.imgloc }/>
                            </div>
                        }

                        {/* <div className="dms-ctn-scroll-wrapper"> */}
                            <div className={`dms-ctn ${curChat ? "dms-ctn--active" : "" }`}>
                                {
                                    curChat ? 
                                        
                                        <>
                                            {
                                                messagingState?.messages.map((message, i) => 
                                                i === (messagingState.messages.length - 1) ? 
                                                    <Fragment key={message.msg_id}>
                                                        <Message                                  
                                                        uId={ user.uId } 
                                                        uIdFrom={ message.u_id_from }
                                                        msgText={ message.msg_text }
                                                        time={ message.time }
                                                        />
                                                        {            
                                                            <p className="dm-sction-date">
                                                                { message.date }
                                                            </p>
                                                            
                                                        }
                                                        
                                                    </Fragment>

                                                :   messagingState.messages[i+1].date === message.date ?
                                                    
                                                        <Message 
                                                        key={ message.msg_id } 
                                                        uId={ user.uId } 
                                                        uIdFrom={ message.u_id_from }
                                                        msgText={ message.msg_text }
                                                        time={ message.time }
                                                        />
                                                    
                                                    :   <Fragment key={message.msg_id}>
                                                            <Message                                            
                                                            uId={ user.uId } 
                                                            uIdFrom={ message.u_id_from }
                                                            msgText={ message.msg_text }
                                                        time={ message.time }
                                                            />
                                                            {            
                                                                <p className="dm-sction-date">
                                                                    { message.date }
                                                                </p>
                                                            }
                                                        </Fragment>
                                                )
                                            }
                                        </>
                            
                                    :   <p>Select a chat</p>
                                }
                            </div>
                        {/* </div> */}

                        {
                            curChat && 
                            <div className="dm-inpt-ctn">
                                <input 
                                type="text" 
                                name="msg-input"
                                value={ msgInput }
                                onChange={e => setMsgInput(e.target.value)}
                                placeholder="Message..."
                                />
                                <button 
                                className={`send-dm-btn ${msgInput === "" ? "dm-btn-disb" : "" }`}
                                onClick={ handleMsgSubmit }>
                                    <img src="/send.svg" alt="send" />
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

    // messagingState.messages.forEach(message => {
    //     const odate = new Date(message.date_time);
    //     console.log(odate.toString().split(" "));
    // });

    // function isSameDay(d1, d2) {
    //     return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    // }
    return (
        <div className="dming-ctn-wrapper">

            <div className="dming-ctn">

                <div className="frnds-ctn">

                    <div className="new-chat">
                        <Link 
                        to="/messages/new"
                        onClick={() => dispatch(setNewChat())}>
                            New Chat
                        </Link>
                    </div>
                    <input type="text" 
                    value={ filter }
                    onChange={ e => setFilter(e.target.value.toLowerCase())}
                    placeholder="Search..."
                    />
                {   
                    filter !== "" ? 
                        messagingState?.contacted.map((friend, i) => {
                            if (friend.name.toLowerCase().includes(filter) || friend.username.toLowerCase().includes(filter)) {
                                return (
                                    <Friend 
                                    key={ friend.u_id }
                                    active={ active[i] }
                                    onClick={ active[i] 
                                        ? null
                                        : () => history.push(`/messages/${friend.username}`)
                                    }
                                    username={ friend.username }
                                    name={ friend.name }
                                    imgloc={ friend.imgloc } />
                                )
                            }
                        })

                    :   messagingState?.contacted.map((friend, i) => 
                        <Friend 
                        key={ friend.u_id }
                        active={ active[i] }
                        onClick={ active[i] 
                            ? null
                            : () => history.push(`/messages/${friend.username}`)
                        }
                        username={ friend.username }
                        name={ friend.name }
                        imgloc={ friend.imgloc } />
                    )
                }
                </div>

                <div className="dm-ctn">
                    {
                        curChat && 
                        <Profile 
                        name={ curChat.name }
                        username={ curChat.username }
                        profImgSrc={ curChat.imgloc }/>
                    }

                    {/* <div className="dms-ctn-scroll-wrapper"> */}
                        <div className={`dms-ctn ${curChat ? "dms-ctn--active" : "" }`}>
                            {
                                curChat ? 
                                    
                                    <>
                                        {
                                            messagingState?.messages.map((message, i) => 
                                                i === (messagingState.messages.length - 1) ? 
                                                    <Fragment key={message.msg_id}>
                                                        <Message                                  
                                                        uId={ user.uId } 
                                                        uIdFrom={ message.u_id_from }
                                                        msgText={ message.msg_text }
                                                        time={ message.time }
                                                        />
                                                        {            
                                                            <p className="dm-sction-date">
                                                                { message.date }
                                                            </p>
                                                            
                                                        }
                                                        
                                                    </Fragment>

                                                :   messagingState.messages[i+1].date === message.date ?
                                                    
                                                        <Message 
                                                        key={ message.msg_id } 
                                                        uId={ user.uId } 
                                                        uIdFrom={ message.u_id_from }
                                                        msgText={ message.msg_text }
                                                        time={ message.time }
                                                        />
                                                    
                                                    :   <Fragment key={message.msg_id}>
                                                            <Message                                            
                                                            uId={ user.uId } 
                                                            uIdFrom={ message.u_id_from }
                                                            msgText={ message.msg_text }
                                                        time={ message.time }
                                                            />
                                                            {            
                                                                <p className="dm-sction-date">
                                                                    { message.date }
                                                                </p>
                                                            }
                                                        </Fragment>
                                            )
                                        }
                                    </>
                        
                                :   <p>Select a chat</p>
                            }
                        </div>
                    {/* </div> */}

                    {
                        curChat && 
                        <div className="dm-inpt-ctn">
                            <input 
                            type="text" 
                            name="msg-input"
                            value={ msgInput }
                            onChange={e => setMsgInput(e.target.value)}
                            placeholder="Message..."
                            />
                            <button 
                            className={`send-dm-btn ${msgInput === "" ? "dm-btn-disb" : "" }`}
                            onClick={ handleMsgSubmit }>
                                <img src="/send.svg" alt="send" />
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Messaging;

//const contacted = useSelector(state => state.messaging?.contacted);
//const messages = useSelector(state => state.messaging?.messages);
// const [contacted, setContacted] = useState(null);
// const [chatSectionDate, setChatSectionDate] = useState({ date: null, display: false });
// const chatSectionDate = useRef({ date: null, display: false })
// const [chatDateState, setChatDateState] = useState([]);
// const chatSectionDateRef = useRef(null);

// useEffect(() => {
//     const temp = [];
//     if (messagingState?.messages) {
//         let dateCheck = null;
//         for (let i = 0; i < messagingState.messages.length; i++) {
//             let tempDate = new Date(messagingState.messages[i].date).toLocaleString("default", {
//                 dateStyle: "full"
//             }).split(" ").slice(1).join(" ");
//             if (tempDate !== dateCheck) {
//                 temp.push(tempDate);
//                 dateCheck = tempDate;
//             };
//             //console.log(tempDate, dateCheck);
//         }
//         //console.log(temp);
//         setChatDateState([ ...temp ]);
//     };
    
// }, [messagingState?.messages]);

// messagingState.messages[i].date === message.date ?
                                    
//                                         <Message 
//                                         key={ message.msg_id } 
//                                         uId={ user.uId } 
//                                         message={ message }
//                                         />
                                    
//                                     :   <>
//                                         {            
//                                             <p 
//                                             key={ message.msg_id+1 } 
//                                             className="dm-sction-date">
//                                                 { message.date }
//                                             </p>
//                                         }
//                                             <Message 
//                                             key={ message.msg_id } 
//                                             uId={ user.uId } 
//                                             message={ message }
//                                             />
//                                         </>

// messagingState?.messages.map((message, i) => 
//     <>
//         {            
//             chatSectionDate.display && 
//                 <p key={i} className="dm-sction-date">
//                     { chatSectionDateRef.current }
//                 </p>
//         }
//         <Message 
//         key={ message.msg_id } 
//         uId={ user.uId } 
//         message={ message }
//         chatSectionDate={ chatSectionDate }
//         setChatSectionDate={ setChatSectionDate }
//         chatSectionDateRef={ chatSectionDateRef }
//         />
//     </>
// )

// chatDateState.map((chatDate, i) => 
//                                 <>
//                                     {             
//                                         <p key={i} className="dm-sction-date">
//                                             { chatDate }
//                                         </p>
//                                     }
//                                     {
//                                         messagingState?.messages.map(message => 
//                                             <Message 
//                                             key={ message.msg_id } 
//                                             uId={ user.uId } 
//                                             message={ message }
//                                             chatSectionDate={ chatSectionDate }
//                                             setChatSectionDate={ setChatSectionDate }
//                                             chatSectionDateRef={ chatSectionDateRef }
//                                             />)
//                                     }
//                                 </>
//                             )

// function activeOnClick(fndUname) {
//     setActive(messagingState?.contacted.map((act, i) => {
//         if (fndUname === messagingState?.contacted[i].username) {
//             setCurChat(messagingState?.contacted[i]);
//             return true;
//         } else {
//             return false;
//         };
//     }));
// };
//console.log(messagingState);

//console.log(messagingState?.messages);