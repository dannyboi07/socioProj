import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setFailure } from "../../reducers/failureReducer";
import { addChat } from "../../reducers/messagingReducer";
import { getContacts } from "../../services/messageService";
import { PrimBgDiv } from "../../styledComponents/PrimBgDiv";
import { StyledInput } from "../../styledComponents/StyledInput";
import { Text } from "../../styledComponents/Text";
import FailureComp from "../FailureComp/FailureComp";
import Friend from "../Friend/Friend";
import LoadingComp from "../LoadingComp/LoadingComp";
import "./newchat.css";

function NewChat() {
	const history = useHistory();
	const dispatch = useDispatch();
	const userToken = useSelector(state => state.user.token);
	const failureState = useSelector(state => state.failure?.type === "NEW_CHAT");
	//const [err, setErr] = useState(false);
	const [friends, setFriends] = useState(null);
	const [filtered, setFiltered] = useState("");

	useEffect(() => {

		if (userToken) {
			getContacts(userToken)
				.then(res => setFriends(res))
				.catch(err => {
					console.error(err);
					dispatch(setFailure("NEW_CHAT", null));
				});
		}
	}, []);

	function handleNewChatClick(friend) {
		history.replace(`/messages/new/${friend.username}`, null);
		dispatch(addChat(friend));
	}

	if (failureState) {
		return (
			<PrimBgDiv className="nw-chat-ctn">
				<FailureComp />
			</PrimBgDiv>
		);
	}

	if (!friends) {
		return (
			<PrimBgDiv className="nw-chat-ctn">
				<LoadingComp mini={true} />
			</PrimBgDiv>
		);
	}

	// filtered !== "" ?
	//     friends.map(friend => friend.name.contains(filtered)
	//         || friend.username.contains(filtered) ?
	//             <Friend
	//             key={ friend.u_id }
	//             username={ friend.username }
	//             name={ friend.name }
	//             imgloc={ friend.imgloc }
	//             onClick={ () => handleNewChatClick(friend) }
	//             />
	//         :   null)
	// :   friends.length === 0 ?
	//         <p>
	//             No friends
	//         </p>
	//     :   friends.map(friend =>
	//             <Friend
	//             key={ friend.u_id }
	//             username={ friend.username }
	//             name={ friend.name }
	//             imgloc={ friend.imgloc }
	//             onClick={ () => handleNewChatClick(friend) }
	//             />
	//         )

	return (
		<PrimBgDiv className="nw-chat-ctn">

			<StyledInput type="text"
				value={ filtered }
				onChange={ e => setFiltered(e.target.value.toLowerCase())}
				placeholder="Search..."
			/>

			{
				filtered !== "" ?
					friends.map(friend => {
						if (friend.name.toLowerCase().includes(filtered) || friend.username.toLowerCase().includes(filtered)) {
							return (
								<Friend key={ friend.u_id } username={ friend.username }
									name={ friend.name } imgloc={ friend.imgloc }
									onClick={ () => handleNewChatClick(friend) }
								/>
							);
						}
					})
					:   friends.length === 0 ?
						<Text>
                            No friends
						</Text>
						:   friends.map(friend =>
							<Friend
								key={ friend.u_id }
								username={ friend.username }
								name={ friend.name }
								imgloc={ friend.imgloc }
								onClick={ () => handleNewChatClick(friend) }
							/>
						)
			}
		</PrimBgDiv>
	);
}

export default NewChat;

// filtered !== "" ?
// friends.map(friend => {
// if (friend.name.contains(filtered) || friend.username.contains(filtered)) {
//     return (
//         <Friend key={ friend.u_id } username={ friend.username }
//             name={ friend.name } imgloc={ friend.imgloc }
//             onClick={ () => handleNewChatClick(friend) }
//         />
//     );
// };
// })
// :   friends.length === 0 ?
//     <p>
//         No friends
//     </p>
// :   friends.map(friend =>
//         <Friend
//         key={ friend.u_id }
//         username={ friend.username }
//         name={ friend.name }
//         imgloc={ friend.imgloc }
//         onClick={ () => handleNewChatClick(friend) }
//         />
//     )