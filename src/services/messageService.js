import axios from "axios";
import url from "./baseUrl";
const baseUrl = `${url}/api/comms`;

async function getContacted(token) {
	const response = await axios.get(`${baseUrl}/contacted`, {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});

	return response.data;
}

async function getContacts(token) {
	const response = await axios.get(`${baseUrl}/contacts`, {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});

	return response.data;
}

async function getMsgs(token, frndId) {
	const response = await axios.get(`${baseUrl}/messages/${frndId}`, {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});

	return response.data;
}

async function postMsg(token, frndId, msgText) {
	const response = await axios.post(`${baseUrl}/message/${frndId}`, { msgText }, {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});

	return response.data;
}

export { getContacted, getMsgs, getContacts, postMsg };