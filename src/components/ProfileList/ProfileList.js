import React from "react";
import LoadingComp from "../LoadingComp/LoadingComp";
import Profile from "../Profile/Profile";
import { SecBgDiv } from "../../styledComponents/SecBgDiv";
import "./ProfileList.css";

function ProfileList({ postId, className, likestate, likeResults, profListRef }) {

	if (!likeResults) {
		return (
			<SecBgDiv id={`likes${postId}`} className={`${className}`} style={ likestate } ref={ profListRef }>
				<LoadingComp />
			</SecBgDiv>
		);
	}
	else if (likeResults.length === 0) {
		return (
			<SecBgDiv id={`likes${postId}`} className={`${className} likes-ctn--no-likes`} style={ likestate } ref={ profListRef }>
				<div className="no-likes-ctn">
					<p>No one here :(</p>
				</div>
			</SecBgDiv>
		);
	}

	return (
		<SecBgDiv id={`likes${postId}`} className={ className } style={ likestate } ref={ profListRef }>
			{
				likeResults.map(like => <Profile key={ like.like_id } name={ like.name } username={ like.username } profImgSrc={ like.imgloc }/>)
			}
		</SecBgDiv>
	);
}

export default ProfileList;