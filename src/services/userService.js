import axios from "axios";
import url from "./baseUrl";
const baseUrl = `${url}/api/user`;

async function getUser(userName, token = null) {
	if (token) {
		const response = await axios.get(`${baseUrl}?uname=${userName}`, {
			headers: {
				"Authorization": `Bearer ${token}`
			},
		});
		return response.data;
	}
	const response = await axios.get(`${baseUrl}?uname=${userName}`);
	return response.data;
}

async function followUser(followUId, token) {

	const response = await axios.post(`${baseUrl}/follow/${followUId}`, null, {
		headers: {
			"Authorization": `Bearer ${token}`
		},
	});

	return response.data;
}

async function unFollowUser(unFollowUId, token) {

	const response = await axios.delete(`${baseUrl}/follow/${unFollowUId}`, {
		headers: {
			"Authorization": `Bearer ${token}`
		},
	});
	return response.data;
}

export { getUser, followUser, unFollowUser };