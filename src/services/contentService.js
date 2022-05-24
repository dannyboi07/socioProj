import axios from "axios";
//const baseUrl = "http://localhost:3500/api/content";
const baseUrl = "https://secure-meadow-40264.herokuapp.com/api/content";

async function getAllService(token) {
	if (token) {
		const response = await axios.get(baseUrl, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	}
	const response = await axios.get(baseUrl);
	return response.data;
}

async function getPost(postId) {
	const response = await axios.get(`${baseUrl}/post/${postId}`);
	return response.data;
}

async function getPostLikers(postId) {
	const response = await axios.get(`${baseUrl}/post/likes/${postId}`);
	return response.data;
}

async function createPost(postContent, token) {
	const response = await axios.post(`${baseUrl}/createPost/`, postContent, {
		headers: {
			"Authorization" : `Bearer ${token}`
		}
	});

	return response.data;
}

async function likedOrNot(postId, userId) {
	const response = await axios.get(`${baseUrl}/post/liked/${postId}?user_id=${userId}`);

	return response.data;
}

async function likePost(postId, token) {
	const response = await axios.post(`${baseUrl}/post/like/${postId}`, null, {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});
	return response.data;
}

async function unlikePost(postId, token) {
	const response = await axios.delete(`${baseUrl}/post/like/${postId}`, {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});
	return response.data;
}

async function getPostComms(postId) {
	const response = await axios.get(`${baseUrl}/post/${postId}/comments`);
	return response.data;
}

async function postComm(postId, comment ,token) {
	console.log(postId, comment, token);
	const response = await axios.post(`${baseUrl}/post/${postId}/comment`, { comment }, {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});

	return response.data;
}

export { getAllService, getPost, getPostLikers, createPost, likedOrNot, likePost, unlikePost, getPostComms, postComm };