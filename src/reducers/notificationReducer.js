import { getNotifs, deleteNotif } from "../services/notifService";
import { setFailure } from "./failureReducer";
import { setStatusNotif } from "./statusNotifReducer";

// const init = [
//     {
//         primaryKey: 2,
//         title: "Test from FE",
//         body: "Test FE text sdkjs df sdlf jsd fs dfjs jld jsd fsd",
//         icon: "http://localhost:3500/images/profile-pics/profileimg-1645003992638-711595105.jpg",
//         url: "http://localhost:3000/post/42"
//     }
// ]

export default function notificationReducer(state = null, action) {
    switch(action.type) {
        case "INIT_NOTI":

            return [ ...action.data ];
        case "ADD_NOTI":

            if (state) return [ ...action.data, ...state ];
            return [ ...action.data ];
        case "REMOVE_NOTI":
            return state.filter(notif => notif.primaryKey !== action.data);
        case "CLR_NOTI":
            
            return null;
        default:
            return state;
    };
};

function getAllNotifs(token) {
    return async dispatch => {

        let response;
        try {
            response = await getNotifs(token);
        } catch (error) {
            console.error(error);
            dispatch(setFailure("NOTIF", { 
                func: getAllNotifs, 
                param: token 
            }));
            return;
        };
        dispatch({
            type: "INIT_NOTI",
            data: response
        });
    };
};

function addNotif(data) {
    return({
        type: "ADD_NOTI",
        data
    });
};

function removeNotif(token, notifId) {
    return async dispatch => {
        try {
            await deleteNotif(token, notifId);
        } catch(err) {
            console.error(err);
            dispatch(setStatusNotif("SER_ERR_NOTIF", "Failed to mark as read", 3));
            return;
        }
        dispatch({
            type: "REMOVE_NOTI",
            data: notifId
        });
    };
};

function clearNotifs() {
    return({
        type: "CLR_NOTI",
        data: null
    });
};

export { getAllNotifs, addNotif, removeNotif, clearNotifs };