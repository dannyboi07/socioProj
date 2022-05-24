import React from "react";
import { Text } from "../../styledComponents/Text";
import Profile from "../Profile/Profile";
import "./comment.css";

function Comment({ commentData }) {
	return (
		<div className="comment-ctn">
			<Profile name={ commentData.name } username={ commentData.username } profImgSrc={ commentData.imgloc } inCmt={ true }/>
			<hr/>
			<Text>
				{ commentData.comment }
			</Text>
		</div>
	);
}

export default Comment;