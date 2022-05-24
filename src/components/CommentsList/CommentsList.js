import React from "react";
import Comment from "../Comment/Comment";
import LoadingComp from "../LoadingComp/LoadingComp";
import { SecBgDiv } from "../../styledComponents/SecBgDiv";
import "./commentslist.css";

function CommentsList({ postId, commentsData, comsState, commListRef, inFlscrn }) {

	if (!commentsData) {
		return (
			<SecBgDiv id={`comms${postId}`} className={`comments-list-ctn ${inFlscrn ? "cmt-lst-ctn--mdfy" : "" }`} style={ comsState } ref={ commListRef }>
				<LoadingComp mini={true}/>
			</SecBgDiv>
		);
	}

	if (commentsData.length === 0) {
		return (
			<SecBgDiv id={`comms${postId}`} className={`comments-list-ctn ${inFlscrn ? "cmt-lst-ctn--mdfy" : "" }`} style={ comsState } ref={ commListRef }>
				<div className="no-cms-ctn">
					<p>
                        No Comments
					</p>
				</div>
			</SecBgDiv>
		);
	}

	return (
		<SecBgDiv id={`comms${postId}`} className={`comments-list-ctn ${inFlscrn ? "cmt-lst-ctn--mdfy" : "" }`} style={ comsState } ref={ commListRef }>
			{
				commentsData.map(commentData => <Comment key={ commentData.comment_id } commentData={ commentData }/>)
			}
		</SecBgDiv>
	);
}

export default CommentsList;