import React, { useState, useEffect, Fragment, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams, useLocation } from "react-router-dom";
// import { getContacted, getMsgs } from '../../services/messageService';
import {
	clrMsging,
	getContactedRdx,
	getMsgsRdx,
	postMsgRdx,
} from "../../reducers/messagingReducer";
// import FriendsCtn from '../FrndsCtn/FriendsCtn';
import Friend from "../Friend/Friend";
import Profile from "../Profile/Profile";
import Message from "../Message/Message";
import "./messaging.css";
import LoadingComp from "../LoadingComp/LoadingComp";
import FailureComp from "../FailureComp/FailureComp";
import { setNewChat } from "../../reducers/fullScreenReducer";
import { setStatusNotif } from "../../reducers/statusNotifReducer";
import { SecBgDiv } from "../../styledComponents/SecBgDiv";
import { PrimBgDiv } from "../../styledComponents/PrimBgDiv";
import { StyledInput } from "../../styledComponents/StyledInput";
import StyledNewChatLink from "../../styledComponents/NewChatLink";
import StyledMsgInput from "../../styledComponents/StyledMsgInput";

import sendBlack from "../../assets/send-b.svg";
import sendWhite from "../../assets/send-w.svg";
import { Text } from "../../styledComponents/Text";

function Messaging() {
	const dispatch = useDispatch();
	const history = useHistory();
	const params = useParams();
	const location = useLocation();
	const user = useSelector((state) => state.user);

	const primCol = useSelector((state) => state.theme?.bgPrim);
	// const actionCol = useSelector(state => state.theme?.action);

	const messagingState = useSelector((state) => state.messaging);
	const failureState = useSelector(
		(state) => state.failure?.type === "MSGING",
	);
	const [active, setActive] = useState([]);
	const [curChat, setCurChat] = useState(null);
	const [msgInput, setMsgInput] = useState("");

	const [filter, setFilter] = useState("");

	const [mobileSwitch, setMobileSwitch] = useState([0, window.screen.width]);

	const [contrast, setContrast] = useState(false);

	useEffect(() => {
		dispatch(getContactedRdx(user.token));

		// First path option indicates that the new chat menu was open when this component was mounting,
		// second indicates that the user had opened a brand new chat with a contact,
		// I indicate that to the user by appending new/{friend's username}, and I remove either of the
		// paths if it exists on a page reload
		if (location.pathname.includes("/new" || "new/")) {
			history.replace("/messages", [location.pathname]);
		}

		// Setting active state variable to an array of falses with the length as the number of friends
		// the user has chatted with already
		if (messagingState?.contacted) {
			const temp = [];
			for (let i = 0; i < messagingState?.contacted.length; i++) {
				temp.push(false);
			}
			setActive([...temp]);
		}

		return () => dispatch(clrMsging());
	}, []);

	useEffect(() => {
		if (params.username && curChat?.username !== params.username) {
			if (messagingState?.contacted) {
				let found = false;
				setActive(
					messagingState?.contacted.map((act, i) => {
						if (
							!found &&
							params.username ===
								messagingState?.contacted[i].username
						) {
							setCurChat(messagingState?.contacted[i]);
							dispatch(
								getMsgsRdx(
									user.token,
									messagingState?.contacted[i].u_id,
								),
							);
							found = true;
							return true;
						} else {
							if (
								i === messagingState.contacted.length - 1 &&
								!found
							) {
								dispatch(
									setStatusNotif(
										"SET_ERR_NOTIF",
										"Couldn't find contact in your chat history or friends list",
										3,
									),
								);
								history.replace("/messages", null);
							}
							return false;
						}
					}),
				);
			}
		} else if (!params.username) {
			setCurChat(null);
			setActive([]);
		}
	}, [params, messagingState?.contacted]); // , curChat

	useEffect(() => {
		if (window.screen.width < 768) {
			if (params.username) {
				setMobileSwitch([-1 * window.screen.width, 0]);
			} else setMobileSwitch([0, window.screen.width]);
		}
	}, [params]);

	useEffect(() => {
		function darkerIcons() {
			const r = parseInt(primCol.substring(1, 3), 16);
			const g = parseInt(primCol.substring(3, 5), 16);
			const b = parseInt(primCol.substring(5, 7), 16);

			return r * 0.299 + g * 0.587 + b * 0.114 > 100;
		}
		setContrast(darkerIcons());
		// Calling this as a bug fix cause when the theme is changed i.e global state theme primCol changes,
		// the Navbar is triggered to rerender, but the classes on settingsToggleRef & settingsRef don't reset,
		// since the classLists on stored on useRefs which don't change across renders aka in this case
		// the classes on the Refs don't change since useRefs stay the same across rerenders
		// but the toggle box collapses since the display state on it comes from a state variable
		// which when the Navbar rerenders goes back to the default declaration state of display: none
	}, [primCol]);

	function handleMsgSubmit() {
		if (msgInput !== "") {
			dispatch(postMsgRdx(user.token, curChat.u_id, msgInput));
			setMsgInput("");
		}
	}

	if (failureState) {
		return (
			<SecBgDiv className="dming-ctn-wrapper">
				<PrimBgDiv className="dming-ctn">
					<FailureComp />
				</PrimBgDiv>
			</SecBgDiv>
		);
	}

	if (!messagingState) {
		return (
			<SecBgDiv className="dming-ctn-wrapper">
				<PrimBgDiv className="dming-ctn">
					<LoadingComp />
				</PrimBgDiv>
			</SecBgDiv>
		);
	}

	if (window.screen.width < 768) {
		return (
			<SecBgDiv className="dming-ctn-wrapper">
				<PrimBgDiv className="dming-ctn">
					<div
						style={{ left: mobileSwitch[0] }}
						className="frnds-ctn"
					>
						<div className="new-chat">
							<StyledNewChatLink
								to="/messages/new"
								onClick={() => dispatch(setNewChat())}
							>
								New Chat
							</StyledNewChatLink>
						</div>

						<StyledInput
							type="text"
							value={filter}
							onChange={(e) =>
								setFilter(e.target.value.toLowerCase())
							}
							placeholder="Search..."
						/>
						{filter !== ""
							? messagingState?.contacted.map((friend, i) => {
								if (
									friend.name
										.toLowerCase()
										.includes(filter) ||
										friend.username
											.toLowerCase()
											.includes(filter)
								) {
									return (
										<Friend
											key={friend.u_id}
											active={active[i]}
											onClick={
												active[i]
													? null
													: () =>
														history.push(
															`/messages/${friend.username}`,
														)
											}
											username={friend.username}
											name={friend.name}
											imgloc={friend.imgloc}
										/>
									);
								}
							  })
							: messagingState?.contacted.map((friend, i) => (
								<Friend
									key={friend.u_id}
									active={active[i]}
									onClick={
										active[i]
											? null
											: () =>
												history.push(
													`/messages/${friend.username}`,
												)
									}
									username={friend.username}
									name={friend.name}
									imgloc={friend.imgloc}
								/>
							  ))}
					</div>

					<div style={{ left: mobileSwitch[1] }} className="dm-ctn">
						{curChat && (
							<div className="dm-ctn__prof">
								<img
									src="/back-arrow.svg"
									alt="Back"
									onClick={() =>
										history.replace("/messages", null)
									}
								/>

								<Profile
									name={curChat.name}
									username={curChat.username}
									profImgSrc={curChat.imgloc}
								/>
							</div>
						)}
						<div
							className={`dms-ctn ${
								curChat ? "dms-ctn--active" : ""
							}`}
						>
							{curChat ? (
								<>
									{messagingState?.messages.map(
										(message, i) =>
											i ===
											messagingState.messages.length -
												1 ? (
													<Fragment key={message.msg_id}>
														<Message
															uId={user.uId}
															uIdFrom={
																message.u_id_from
															}
															msgText={
																message.msg_text
															}
															time={message.time}
														/>
														{
															<p className="dm-sction-date">
																{message.date}
															</p>
														}
													</Fragment>
												) : messagingState.messages[i + 1]
													.date === message.date ? (
														<Message
															key={message.msg_id}
															uId={user.uId}
															uIdFrom={message.u_id_from}
															msgText={message.msg_text}
															time={message.time}
														/>
													) : (
														<Fragment key={message.msg_id}>
															<Message
																uId={user.uId}
																uIdFrom={
																	message.u_id_from
																}
																msgText={
																	message.msg_text
																}
																time={message.time}
															/>
															{
																<p className="dm-sction-date">
																	{message.date}
																</p>
															}
														</Fragment>
													),
									)}
								</>
							) : (
								<p>Select a chat</p>
							)}
						</div>
						{/* </div> */}

						{curChat && (
							<PrimBgDiv className="dm-inpt-ctn">
								<input
									type="text"
									name="msg-input"
									value={msgInput}
									onChange={(e) =>
										setMsgInput(e.target.value)
									}
									placeholder="Message..."
								/>
								<button
									className={`send-dm-btn ${
										msgInput === "" ? "dm-btn-disb" : ""
									}`}
									onClick={handleMsgSubmit}
									title="Send Message"
								>
									{contrast ? (
										<img src={sendBlack} alt="Send" />
									) : (
										<img src={sendWhite} alt="Send" />
									)}
								</button>
							</PrimBgDiv>
						)}
					</div>
				</PrimBgDiv>
			</SecBgDiv>
		);
	}

	// messagingState.messages.forEach(message => {
	//     const odate = new Date(message.date_time);
	//     console.log(odate.toString().split(" "));
	// });

	// function isSameDay(d1, d2) {
	//     return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
	// }
	return (
		<SecBgDiv className="dming-ctn-wrapper">
			<PrimBgDiv className="dming-ctn">
				<div className="frnds-ctn">
					<div className="new-chat">
						<StyledNewChatLink
							to="/messages/new"
							onClick={() => dispatch(setNewChat())}
						>
							New Chat
						</StyledNewChatLink>
					</div>
					<StyledInput
						type="text"
						value={filter}
						onChange={(e) =>
							setFilter(e.target.value.toLowerCase())
						}
						placeholder="Search..."
					/>
					{filter !== ""
						? messagingState?.contacted.map((friend, i) => {
							if (
								friend.name
									.toLowerCase()
									.includes(filter) ||
									friend.username
										.toLowerCase()
										.includes(filter)
							) {
								return (
									<Friend
										key={friend.u_id}
										active={active[i]}
										onClick={
											active[i]
												? null
												: () =>
													history.push(
														`/messages/${friend.username}`,
													)
										}
										username={friend.username}
										name={friend.name}
										imgloc={friend.imgloc}
									/>
								);
							}
						  })
						: messagingState?.contacted.map((friend, i) => (
							<Friend
								key={friend.u_id}
								active={active[i]}
								onClick={
									active[i]
										? null
										: () =>
											history.push(
												`/messages/${friend.username}`,
											)
								}
								username={friend.username}
								name={friend.name}
								imgloc={friend.imgloc}
							/>
						  ))}
				</div>

				<div className="dm-ctn">
					{curChat && (
						<Profile
							name={curChat.name}
							username={curChat.username}
							profImgSrc={curChat.imgloc}
						/>
					)}

					{/* <div className="dms-ctn-scroll-wrapper"> */}
					<div
						className={`dms-ctn ${
							curChat ? "dms-ctn--active" : ""
						}`}
					>
						{curChat ? (
							<>
								{messagingState?.messages.map((message, i) =>
									i === messagingState.messages.length - 1 ? (
										<Fragment key={message.msg_id}>
											<Message
												uId={user.uId}
												uIdFrom={message.u_id_from}
												msgText={message.msg_text}
												time={message.time}
											/>
											{
												<p className="dm-sction-date">
													{message.date}
												</p>
											}
										</Fragment>
									) : messagingState.messages[i + 1].date ===
									  message.date ? (
											<Message
												key={message.msg_id}
												uId={user.uId}
												uIdFrom={message.u_id_from}
												msgText={message.msg_text}
												time={message.time}
											/>
										) : (
											<Fragment key={message.msg_id}>
												<Message
													uId={user.uId}
													uIdFrom={message.u_id_from}
													msgText={message.msg_text}
													time={message.time}
												/>
												{
													<p className="dm-sction-date">
														{message.date}
													</p>
												}
											</Fragment>
										),
								)}
							</>
						) : (
							<Text>Select a chat</Text>
						)}
					</div>
					{/* </div> */}

					{curChat && (
						<PrimBgDiv className="dm-inpt-ctn">
							<StyledMsgInput
								type="text"
								name="msg-input"
								value={msgInput}
								onChange={(e) => setMsgInput(e.target.value)}
								placeholder="Message..."
							/>
							<button
								className={`send-dm-btn ${
									msgInput === "" ? "dm-btn-disb" : ""
								}`}
								onClick={handleMsgSubmit}
								title="Send Message"
							>
								{contrast ? (
									<img src={sendBlack} alt="Send" />
								) : (
									<img src={sendWhite} alt="Send" />
								)}
							</button>
						</PrimBgDiv>
					)}
				</div>
			</PrimBgDiv>
		</SecBgDiv>
	);
}

export default memo(Messaging);

//const contacted = useSelector(state => state.messaging?.contacted);
//const messages = useSelector(state => state.messaging?.messages);
// const [contacted, setContacted] = useState(null);
// const [chatSectionDate, setChatSectionDate] = useState({ date: null, display: false });
// const chatSectionDate = useRef({ date: null, display: false })
// const [chatDateState, setChatDateState] = useState([]);
// const chatSectionDateRef = useRef(null);

// useEffect(() => {
//     const temp = [];
//     if (messagingState?.messages) {
//         let dateCheck = null;
//         for (let i = 0; i < messagingState.messages.length; i++) {
//             let tempDate = new Date(messagingState.messages[i].date).toLocaleString("default", {
//                 dateStyle: "full"
//             }).split(" ").slice(1).join(" ");
//             if (tempDate !== dateCheck) {
//                 temp.push(tempDate);
//                 dateCheck = tempDate;
//             };
//             //console.log(tempDate, dateCheck);
//         }
//         //console.log(temp);
//         setChatDateState([ ...temp ]);
//     };

// }, [messagingState?.messages]);

// messagingState.messages[i].date === message.date ?

//                                         <Message
//                                         key={ message.msg_id }
//                                         uId={ user.uId }
//                                         message={ message }
//                                         />

//                                     :   <>
//                                         {
//                                             <p
//                                             key={ message.msg_id+1 }
//                                             className="dm-sction-date">
//                                                 { message.date }
//                                             </p>
//                                         }
//                                             <Message
//                                             key={ message.msg_id }
//                                             uId={ user.uId }
//                                             message={ message }
//                                             />
//                                         </>

// messagingState?.messages.map((message, i) =>
//     <>
//         {
//             chatSectionDate.display &&
//                 <p key={i} className="dm-sction-date">
//                     { chatSectionDateRef.current }
//                 </p>
//         }
//         <Message
//         key={ message.msg_id }
//         uId={ user.uId }
//         message={ message }
//         chatSectionDate={ chatSectionDate }
//         setChatSectionDate={ setChatSectionDate }
//         chatSectionDateRef={ chatSectionDateRef }
//         />
//     </>
// )

// chatDateState.map((chatDate, i) =>
//                                 <>
//                                     {
//                                         <p key={i} className="dm-sction-date">
//                                             { chatDate }
//                                         </p>
//                                     }
//                                     {
//                                         messagingState?.messages.map(message =>
//                                             <Message
//                                             key={ message.msg_id }
//                                             uId={ user.uId }
//                                             message={ message }
//                                             chatSectionDate={ chatSectionDate }
//                                             setChatSectionDate={ setChatSectionDate }
//                                             chatSectionDateRef={ chatSectionDateRef }
//                                             />)
//                                     }
//                                 </>
//                             )

// function activeOnClick(fndUname) {
//     setActive(messagingState?.contacted.map((act, i) => {
//         if (fndUname === messagingState?.contacted[i].username) {
//             setCurChat(messagingState?.contacted[i]);
//             return true;
//         } else {
//             return false;
//         };
//     }));
// };
//console.log(messagingState);

//console.log(messagingState?.messages);
