import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { followUser, unFollowUser } from "../../services/userService";
import "./profile.css";
import { Text } from "../../styledComponents/Text";
import { Button } from "../../styledComponents/Button";
import NameLink from "../../styledComponents/NameLink";

function Profile({
	name,
	username,
	profImgSrc,
	postUid,
	friends,
	inCmt,
	inMain,
}) {
	const history = useHistory();
	const userDetails = useSelector((state) => state.user);
	const [friend, setFriend] = useState(friends);

	// function handleUsernameClick() {
	//   history.push(`/users/${username}`);
	// };
	// console.log(name, friends);

	async function friendClickHandle() {
		try {
			if (!userDetails) {
				history.push("/login");
			} else if (friend) {
				await unFollowUser(postUid, userDetails.token);
				setFriend(!friend);
			} else if (!friend) {
				await followUser(postUid, userDetails.token);
				setFriend(!friend);
			}
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<div className={`profile-ctn ${inCmt ? "profile-ctn--cmt" : ""}`}>
			<div className={`prof-img-ctn ${inCmt ? "prof-img-ctn--cmt" : ""}`}>
				<img src={profImgSrc} alt="Profile" />
			</div>

			<div className="prof-details-ctn">
				<Text>{name}</Text>

				<NameLink to={`/users/${username}`}>@{username}</NameLink>
			</div>

			{inMain && userDetails?.uId !== postUid && (
				<Button
					className={`friend-btn ${
						friend ? "unfrnd-btn" : "frnd-btn"
					}`}
					onClick={friendClickHandle}
				>
					{userDetails
						? friend
							? "Unfriend"
							: "Add friend"
						: "Add friend"}
				</Button>
			)}
		</div>
	);
}

export default Profile;

// <img src="/checked-user.svg" alt="Unfriend"></img>
// <img src='/add-user.svg' alt="Add Friend"></img>
// <img src="/add-user.svg" alt="Add Friend"></img>
