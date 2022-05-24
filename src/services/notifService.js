import axios from "axios";
import url from "./baseUrl";
const baseUrl = `${url}/api/user/notifs`;

async function getNotifs(token) {
	const response = await axios.get(baseUrl, {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});

	return response.data;
}

async function getNotifsCount(token) {
	const response = await axios.get(`${baseUrl}count`, {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});

	return response.data;
}

async function deleteNotif(token, notifId) {
	await axios.delete(`http://localhost:3500/api/user/notif/${notifId}`, {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});
}

export { getNotifs, getNotifsCount, deleteNotif };