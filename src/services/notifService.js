import axios from "axios";
//const baseUrl = "http://localhost:3500/api/user/notifs";
const baseUrl = "https://secure-meadow-40264.herokuapp.com/user/notifs"

async function getNotifs(token) {
    const response = await axios.get(baseUrl, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.data;
};

async function getNotifsCount(token) {
    const response = await axios.get(`${baseUrl}count`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.data;
};

async function deleteNotif(token, notifId) {
    await axios.delete(`http://localhost:3500/api/user/notif/${notifId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
};

export { getNotifs, getNotifsCount, deleteNotif };