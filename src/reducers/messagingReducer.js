import { getContacted, getMsgs, postMsg } from "../services/messageService";
import { setFailure } from "./failureReducer";
import { setStatusNotif } from "./statusNotifReducer";

export default function messagingReducer(state = null, action) {

    switch(action.type) {
        case "GET_CONTACTED":
            return { 
                contacted: [ ...action.data ], 
                messages: [] 
            };
        case "GET_MSGS":
            return { 
                contacted: [ ...state.contacted ], 
                messages: [ ...action.data ]
            };
        case "ADD_MSG": 
            return {
                contacted: [ ...state.contacted ],
                messages: [ ...state.messages, ...action.data ]
            };
        case "ADD_NEW_CHAT":
            let exists = false;
            for (let i = 0; i < state.contacted.length; i++) {
                if (state.contacted[i].u_id === action.data.u_id) {
                    exists = true;
                }
            }
            return {
                contacted: exists ? 
                    [ ...state.contacted ]
                    : [ action.data, ...state.contacted ],
                messages: [ ...state.messages ]
            };
        case "CLR_MSGING":
            return null;
        default:
            return state;
    };
};

function getContactedRdx(token) {
    return async dispatch => {

        let resContacted;
        try {

            resContacted = await getContacted(token);
        } catch(err) {
            console.error(err);
            dispatch(setFailure("MSGING", { 
                func: getContactedRdx, 
                param: token 
            }));
            return;
        };

        dispatch({
            type: "GET_CONTACTED",
            data: resContacted
        });
    };
};

function getMsgsRdx(token, frndUid) {
    return async dispatch => {

        let msgs;
        try {
            
            msgs = await getMsgs(token, frndUid);
        } catch (err) {
            console.error(err);
            return;
        };
        dispatch({
            type: "GET_MSGS",
            data: msgs
        });
    };
};

function postMsgRdx(token, frndUid, msgText) {
    return async dispatch => {
        let resMsg;
        try {
            resMsg = await postMsg(token, frndUid, msgText);
        } catch(err) {
            console.error(err);
            dispatch(setStatusNotif("SET_ERR_NOTIF", "Failed to send message", 3));
            return;
        }
        dispatch({
            type: "ADD_MSG",
            data: resMsg
        });
    };
};

function addMsg(data) {
    return({
        type: "ADD_MSG",
        data
    })
};

function addChat(data) {
    return({
        type: "ADD_NEW_CHAT",
        data
    });
};

function clrMsging() {
    return({
        type: "CLR_MSGING",
        data: null
    })
};

export { getContactedRdx, getMsgsRdx, clrMsging, postMsgRdx, addMsg, addChat };


// contacted: state.contacted.map(contact => {
//     if (contact.u_id === action.data.u_id) {
//         return contact;
//     } else if (contact.u_id !== action.data.u_id) {
//         return action.data;
//     }
// }),
// contacted: state.contacted.map(contact => contact.u_id === action.data.u_id ? contact : action.data),