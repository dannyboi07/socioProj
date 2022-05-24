import {
	createPost,
	getAllService,
	likePost,
	unlikePost,
} from "../services/contentService";
import { setFailure } from "./failureReducer";
import { setStatusNotif } from "./statusNotifReducer";
import { dispatchLogOut } from "./userReducer";
import changeroute from "../utils/customEvents";

export default function postblogReducer(state = null, action) {
	switch (action.type) {
	case "GET_ALL":
		return (state = { ...action.data });
	case "GET_BLOGS":
		return (state = { ...action.data });
	case "GET_POSTS":
		return (state = { ...action.data });
	case "CREATE_POST":
		return {
			posts: [...action.data, ...state.posts],
			blogs: [...state.blogs],
		};
	case "LIKE_POST":
		return (state = {
			...state,
			posts: state.posts.map((post) =>
				post.p_id === action.data
					? { likes: (post.likes += 1), ...post }
					: post,
			),
		});
	case "UNLIKE_POST":
		return (state = {
			...state,
			posts: state.posts.map((post) =>
				post.p_id === action.data
					? { likes: (post.likes -= 1), ...post }
					: post,
			),
		});
	case "CLR_POSTS":
		return null;
	default:
		return state;
	}
}

function getAll(token) {
	return async (dispatch) => {
		let all;
		try {
			all = await getAllService(token);
		} catch (err) {
			console.error(err);
			if (err.response && err.response.status === 401) {
				dispatch(dispatchLogOut());
				dispatch(
					setStatusNotif(
						"SET_ERR_NOTIF",
						err.response.data.error,
						3,
					),
				);
				window.dispatchEvent(changeroute);
				return;
			}
			dispatch(
				setFailure("CONTENT", {
					func: getAll,
					param: token,
				}),
			);
			return;
		}
		// Finally, if all good
		dispatch({
			type: "GET_ALL",
			data: all,
		});
	};
}

function sendPost(postContent, token) {
	return async (dispatch) => {
		let response;
		try {
			response = await createPost(postContent, token);
		} catch (err) {
			console.error(err);
			if (err.response && err.response.status === 401) {
				dispatch(dispatchLogOut());
				dispatch(
					setStatusNotif(
						"SET_ERR_NOTIF",
						err.response.data.error,
						3,
					),
				);
				window.dispatchEvent(changeroute);
				return;
			}
			dispatch(
				setStatusNotif("SET_ERR_NOTIF", err.response.data.error, 3),
			);
			return;
		}
		dispatch({
			type: "CREATE_POST",
			data: response,
		});
	};
}

function likePostRdx(postId, token) {
	return async (dispatch) => {
		// let response;
		try {
			await likePost(postId, token);
		} catch (err) {
			console.error(err);
			if (err.response && err.response.status === 401) {
				dispatch(dispatchLogOut());
				dispatch(
					setStatusNotif(
						"SET_ERR_NOTIF",
						err.response.data.error,
						3,
					),
				);
				window.dispatchEvent(changeroute);
				return;
			}
			dispatch(
				setStatusNotif("SET_ERR_NOTIF", err.response.data.error, 3),
			);
			return;
		}

		dispatch({
			type: "LIKE_POST",
			data: postId,
		});
	};
}

function unLikePostRdx(postId, token) {
	return async (dispatch) => {
		// let response;
		try {
			await unlikePost(postId, token);
		} catch (err) {
			console.error(err);
			if (err.response && err.response.status === 401) {
				dispatch(dispatchLogOut());
				dispatch(
					setStatusNotif(
						"SET_ERR_NOTIF",
						err.response.data.error,
						3,
					),
				);
				window.dispatchEvent(changeroute);
				return;
			}
			dispatch(
				setStatusNotif("SET_ERR_NOTIF", err.response.data.error, 3),
			);
			return;
		}
		dispatch({
			type: "UNLIKE_POST",
			data: postId,
		});
	};
}

function clrPosts() {
	return {
		type: "CLR_POSTS",
		data: null,
	};
}

export { getAll, sendPost, likePostRdx, unLikePostRdx, clrPosts };
